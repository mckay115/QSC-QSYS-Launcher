# -*- mode: python ; coding: utf-8 -*-


block_cipher = None
import os
import pyfiglet.fonts


a = Analysis(['main.py'],
             pathex=['C:\\Users\\zlisko\\OneDrive - Lamacchia Group\\Desktop\\qsys-catcher'],
             binaries=[],
             datas=[(os.path.join(os.path.dirname(pyfiglet.fonts.__file__), "*.f*"), os.path.join("pyfiglet", "fonts"))],
             hiddenimports=['pyfiglet', 'pyfiglet.fonts'],
             hookspath=[],
             hooksconfig={},
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)

exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,  
          [],
          name='Q-Sys Launcher',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          upx_exclude=[],
          runtime_tmpdir=None,
          console=True,
          disable_windowed_traceback=False,
          target_arch=None,
          codesign_identity=None,
          entitlements_file=None )
