# Simple HTTP Server for Donation Tracker
param(
    [int]$Port = 8000
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
    $listener.Start()
    Write-Host "Server running at http://localhost:$Port" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    
    # Open the browser
    Start-Process "http://localhost:$Port"
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") {
            $localPath = "/index.html"
        }
        
        $filePath = Join-Path $PSScriptRoot $localPath.TrimStart('/')
        
        Write-Host "Request: $($request.HttpMethod) $($request.Url.LocalPath)" -ForegroundColor Cyan
        
        if (Test-Path $filePath -PathType Leaf) {
            try {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $content.Length
                
                # Set content type based on file extension
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($ext) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".css"  { $response.ContentType = "text/css" }
                    ".js"   { $response.ContentType = "application/javascript" }
                    ".json" { $response.ContentType = "application/json" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".jpeg" { $response.ContentType = "image/jpeg" }
                    ".gif"  { $response.ContentType = "image/gif" }
                    ".ico"  { $response.ContentType = "image/x-icon" }
                    default { $response.ContentType = "application/octet-stream" }
                }
                
                $response.StatusCode = 200
                $response.OutputStream.Write($content, 0, $content.Length)
                Write-Host "  -> 200 OK ($($content.Length) bytes)" -ForegroundColor Green
            }
            catch {
                $response.StatusCode = 500
                $errorContent = [System.Text.Encoding]::UTF8.GetBytes("500 - Internal Server Error")
                $response.ContentLength64 = $errorContent.Length
                $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
                Write-Host "  -> 500 Error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $localPath")
            $response.ContentLength64 = $notFound.Length
            $response.ContentType = "text/plain"
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
            Write-Host "  -> 404 Not Found" -ForegroundColor Yellow
        }
        
        $response.OutputStream.Close()
    }
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    Write-Host "Server stopped." -ForegroundColor Red
}
