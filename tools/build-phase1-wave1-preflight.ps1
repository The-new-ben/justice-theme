param(
    [Parameter(Mandatory = $true)]
    [string]$RunDirectory,

    [Parameter(Mandatory = $true)]
    [string]$EvidenceDirectory
)

$ErrorActionPreference = 'Stop'

$matrixPath = Join-Path $RunDirectory 'analysis\justice-final-action-matrix.csv'
$outputPath = Join-Path $EvidenceDirectory 'wave1-40-live-preflight.csv'
$summaryPath = Join-Path $EvidenceDirectory 'wave1-40-live-preflight-summary.json'

if (-not (Test-Path -LiteralPath $matrixPath)) {
    throw "Missing action matrix: $matrixPath"
}

New-Item -ItemType Directory -Force -Path $EvidenceDirectory | Out-Null

function Normalize-JusticeUrl([string]$Url) {
    try {
        $uri = [Uri]$Url
        $path = [Uri]::UnescapeDataString($uri.AbsolutePath).TrimEnd('/')
        if ([string]::IsNullOrWhiteSpace($path)) {
            $path = '/'
        }
        return ($uri.Scheme.ToLowerInvariant() + '://' + $uri.Host.ToLowerInvariant() + $path.ToLowerInvariant())
    }
    catch {
        return $Url.TrimEnd('/').ToLowerInvariant()
    }
}

function Get-Locations([string]$XmlText) {
    $matches = [regex]::Matches($XmlText, '<loc>\s*(.*?)\s*</loc>', [Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($match in $matches) {
        [Net.WebUtility]::HtmlDecode($match.Groups[1].Value.Trim())
    }
}

$handler = [Net.Http.HttpClientHandler]::new()
$handler.AllowAutoRedirect = $false
$client = [Net.Http.HttpClient]::new($handler)
$client.Timeout = [TimeSpan]::FromSeconds(30)
$client.DefaultRequestHeaders.UserAgent.ParseAdd('Justice-Phase1-Preflight/1.0')

try {
    $sitemapUrls = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $indexXml = $client.GetStringAsync('https://jus-tice.co.il/sitemap_index.xml').GetAwaiter().GetResult()
    $children = @(Get-Locations $indexXml)

    foreach ($child in $children) {
        if ($child -notmatch '\.xml(?:\?|$)') {
            continue
        }
        $childXml = $client.GetStringAsync($child).GetAwaiter().GetResult()
        foreach ($url in (Get-Locations $childXml)) {
            [void]$sitemapUrls.Add((Normalize-JusticeUrl $url))
        }
    }

    $rows = Import-Csv -LiteralPath $matrixPath |
        Where-Object { $_.execution_wave -eq 'WAVE_1_24H_SAFETY_GATE' }

    if ($rows.Count -ne 40) {
        throw "Expected 40 wave-1 safety-gate rows; found $($rows.Count)"
    }

    $results = foreach ($row in $rows) {
        $status = 0
        $location = ''
        $httpError = ''

        try {
            $request = [Net.Http.HttpRequestMessage]::new([Net.Http.HttpMethod]::Get, $row.url)
            $response = $client.SendAsync($request, [Net.Http.HttpCompletionOption]::ResponseHeadersRead).GetAwaiter().GetResult()
            $status = [int]$response.StatusCode
            if ($response.Headers.Location) {
                $location = $response.Headers.Location.ToString()
            }
            $response.Dispose()
            $request.Dispose()
        }
        catch {
            $httpError = $_.Exception.Message
        }

        $normalized = Normalize-JusticeUrl $row.url
        $protectedMoneyPage = $normalized -in @(
            'https://jus-tice.co.il/divorce-lawyer',
            'https://jus-tice.co.il/criminal-defense-attorney',
            'https://jus-tice.co.il/real-estate-attorney',
            'https://jus-tice.co.il/medical-malpractice-lawyer'
        )

        [pscustomobject]@{
            priority = $row.priority
            url = $row.url
            title = $row.title
            owner_url = $row.owner_url
            final_action = $row.final_action
            current_http_status = $status
            current_location = $location
            current_http_error = $httpError
            currently_in_sitemap = $sitemapUrls.Contains($normalized)
            full_clicks = [int]$row.full_clicks
            full_impressions = [int]$row.full_impressions
            recent_90d_clicks = [int]$row.recent_90d_clicks
            recent_90d_impressions = [int]$row.recent_90d_impressions
            gsc_external_links = [int]$row.gsc_external_links
            gsc_internal_links = [int]$row.gsc_internal_links
            public_rest_internal_inlinks = [int]$row.public_rest_internal_inlinks
            word_count = [int]$row.word_count
            decision_reason = $row.decision_reason
            protected_money_page = $protectedMoneyPage
            public_data_gate = if (
                [int]$row.full_clicks -eq 0 -and
                [int]$row.recent_90d_clicks -eq 0 -and
                [int]$row.gsc_external_links -eq 0 -and
                [int]$row.gsc_internal_links -eq 0 -and
                [int]$row.public_rest_internal_inlinks -eq 0 -and
                -not $protectedMoneyPage
            ) { 'PASS' } else { 'REVIEW' }
            crm_lead_gate = 'PENDING_PRIVATE_WP_DATA'
            server_log_gate = 'PENDING_HOST_LOG_ACCESS'
            backup_gate = 'CODE_BACKUP_PASS_HOST_BACKUP_PENDING'
            publish_410_now = 'NO_PRIVATE_GATES_PENDING'
        }
    }

    $results | Export-Csv -LiteralPath $outputPath -NoTypeInformation -Encoding utf8

    $summary = [ordered]@{
        generated_at = (Get-Date).ToString('o')
        source_matrix = $matrixPath
        wave = 'WAVE_1_24H_SAFETY_GATE'
        candidate_count = $results.Count
        http_200_count = @($results | Where-Object current_http_status -eq 200).Count
        http_redirect_count = @($results | Where-Object { $_.current_http_status -in 300..399 }).Count
        http_404_count = @($results | Where-Object current_http_status -eq 404).Count
        in_sitemap_count = @($results | Where-Object currently_in_sitemap -eq $true).Count
        public_data_gate_pass_count = @($results | Where-Object public_data_gate -eq 'PASS').Count
        protected_money_page_count = @($results | Where-Object protected_money_page -eq $true).Count
        publish_410_now_count = @($results | Where-Object publish_410_now -ne 'NO_PRIVATE_GATES_PENDING').Count
        blocking_gates = @('CRM lead history', 'server access logs', 'full host database/media backup')
    }
    $summary | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $summaryPath -Encoding utf8

    $summary | ConvertTo-Json -Depth 4
}
finally {
    $client.Dispose()
    $handler.Dispose()
}
