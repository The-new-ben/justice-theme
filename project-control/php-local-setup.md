# Local PHP Setup
Date: 2026-05-10

## Status

- VERIFIED: PHP was installed locally from `C:\Users\janana\Downloads\php-8.5.6-nts-Win32-vs17-x64.zip`.
- Installed path: `C:\Users\janana\tools\php-8.5.6\php.exe`.
- VERIFIED: CLI reports `PHP 8.5.6 (cli)` with Zend OPcache.
- VERIFIED: full repo PHP lint passed for 127 PHP files after installation.
- FIXED: `tools/php-lint.ps1` now checks the local user-tools PHP path before old Winget fallback paths.

## How To Run

From the repo folder:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\php-lint.ps1
```

## Notes

- This is a local user-folder installation, not a system-wide Windows install.
- No global PATH change was made.
- Live server PHP is separate from local PHP. Public headers currently report PHP 8.4.17 on the live server, while local lint runs on PHP 8.5.6.
