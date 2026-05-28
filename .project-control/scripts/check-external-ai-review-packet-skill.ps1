param(
	[string] $SkillPath = "C:\Users\janana\.codex\skills\justice-external-ai-review-packet"
)

$ErrorActionPreference = "Stop"

function Read-Text {
	param([string] $Path)

	if (-not (Test-Path -LiteralPath $Path)) {
		return ""
	}

	return Get-Content -LiteralPath $Path -Raw
}

function Test-ContainsAll {
	param(
		[string] $Text,
		[string[]] $Tokens
	)

	foreach ($token in $Tokens) {
		if (-not $Text.Contains($token)) {
			return $false
		}
	}

	return $true
}

$skillMd = Join-Path $SkillPath "SKILL.md"
$reference = Join-Path $SkillPath "references\review-prompt-packets.md"
$agentYaml = Join-Path $SkillPath "agents\openai.yaml"

$skillText = Read-Text -Path $skillMd
$referenceText = Read-Text -Path $reference
$agentText = Read-Text -Path $agentYaml

$checks = @(
	[ordered]@{
		name = "skill_md_present"
		pass = $skillText.Length -gt 0
		file = $skillMd
	},
	[ordered]@{
		name = "reference_present"
		pass = $referenceText.Length -gt 0
		file = $reference
	},
	[ordered]@{
		name = "agent_yaml_present"
		pass = $agentText.Length -gt 0
		file = $agentYaml
	},
	[ordered]@{
		name = "frontmatter_and_trigger"
		pass = (Test-ContainsAll -Text $skillText -Tokens @(
			"name: justice-external-ai-review-packet",
			"description:",
			"Lovable",
			"ChatGPT",
			"Gemini",
			"Claude",
			"without paid API spend"
		))
		file = $skillMd
	},
	[ordered]@{
		name = "safety_guardrails"
		pass = (Test-ContainsAll -Text $skillText -Tokens @(
			"Do not use paid APIs",
			"Do not publish public CMS/database",
			"Do not claim Lovable",
			"No invented reviews",
			"No generated lawyer headshot"
		))
		file = $skillMd
	},
	[ordered]@{
		name = "prompt_packets"
		pass = (Test-ContainsAll -Text $referenceText -Tokens @(
			"Homepage Premium Review",
			"Lawyer Profile / Minisite Review",
			"Lead Funnel / Payment Review",
			"Visual / Image Review",
			"https://jus-tice.co.il/",
			"https://www.din.co.il/",
			"https://www.lawreviews.co.il/",
			"https://lawhive.com/"
		))
		file = $reference
	}
)

$failed = @($checks | Where-Object { -not $_.pass })

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	skillPath = $SkillPath
	pass = $failed.Count -eq 0
	failureCount = $failed.Count
	failed = $failed
	checks = $checks
	honestyStatement = "This verifies that the local skill and prompt packet exist. It does not prove any external AI tool was actually used or that any external answer was obtained."
}

$summary | ConvertTo-Json -Depth 8

if (-not $summary.pass) {
	exit 1
}
