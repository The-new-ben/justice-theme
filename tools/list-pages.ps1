$pages = Invoke-RestMethod -Uri 'https://jus-tice.co.il/wp-json/wp/v2/pages?per_page=50&_fields=id,slug,title,link'
foreach ($p in $pages) {
    Write-Host "$($p.id)  $($p.slug)  $($p.link)"
}
