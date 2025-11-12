# Remove old duplicate pages at root level
$dirsToRemove = @(
    "d:\Pranav\AuthorStack\app\dashboard",
    "d:\Pranav\AuthorStack\app\launches",
    "d:\Pranav\AuthorStack\app\competitors",
    "d:\Pranav\AuthorStack\app\settings",
    "d:\Pranav\AuthorStack\app\ab-tests",
    "d:\Pranav\AuthorStack\app\calendar"
)

foreach ($dir in $dirsToRemove) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force
        Write-Host "Removed: $dir"
    }
}

Write-Host "Cleanup complete!"
