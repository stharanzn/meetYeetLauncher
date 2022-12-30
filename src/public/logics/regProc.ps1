New-PSDrive -PSProvider registry -Root HKEY_CLASSES_ROOT -Name HKCR
Set-Location HKCR:


if(Test-Path "HKEY_CLASSES_ROOT\meetyeet"){
    $boolVal = Test-Path "HKEY_CLASSES_ROOT\meetyeet"
    Write-Output $boolVal
    
}else{
    New-Item -Path "HKEY_CLASSES_ROOT\meetyeet" -Force
    Set-Item -Path "HKEY_CLASSES_ROOT\meetyeet" -Value "URL:meetyeet Protocol"
    Set-ItemProperty -Path "HKEY_CLASSES_ROOT\meetyeet" -Name "URL Protocol" - Value "no value set"
    New-Item -Path "HKEY_CLASSES_ROOT\meetyeet\shell\open\command" -Force    
    Set-Item -Path "HKEY_CLASSES_ROOT\meetyeet\shell\open\command" -Value '"C:\Users\Reli\AppData\Roaming\MeetYeet\EY_Metaverse.exe" "%1"'
}

# Read-Host -Prompt "press any key to continue..."