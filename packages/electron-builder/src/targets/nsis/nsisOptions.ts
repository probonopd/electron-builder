import { TargetSpecificOptions } from "../../core"

export interface CommonNsisOptions {
  /**
   * Whether to create [Unicode installer](http://nsis.sourceforge.net/Docs/Chapter1.html#intro-unicode).
   * @default true
   */
  readonly unicode?: boolean

  /**
   * See [GUID vs Application Name](https://github.com/electron-userland/electron-builder/wiki/NSIS#guid-vs-application-name).
   */
  readonly guid?: string | null

  /**
   * If `warningsAsErrors` is `true` (default): NSIS will treat warnings as errors. If `warningsAsErrors` is `false`: NSIS will allow warnings.
   * @default true
   */
  readonly warningsAsErrors?: boolean

  /**
   * @private
   * @default false
   */
  readonly useZip?: boolean
}

/**
 * NSIS options. See [NSIS target notes](https://github.com/electron-userland/electron-builder/wiki/NSIS).
 */
export interface NsisOptions extends CommonNsisOptions, TargetSpecificOptions {
  /**
   * One-click installation.
   * @default true
   */
  readonly oneClick?: boolean

  /***
   * If `oneClick` is `true` (default): Install per all users (per-machine).
   *
   * If `oneClick` is `false`: no install mode installer page (choice per-machine or per-user), always install per-machine.
   * @default false
   */
  readonly perMachine?: boolean

  /**
   * *assisted installer only.* Allow requesting for elevation. If false, user will have to restart installer with elevated permissions.
   * @default true
   */
  readonly allowElevation?: boolean

  /**
   * *assisted installer only.* Whether to allow user to change installation directory.
   * @default false
   */
  readonly allowToChangeInstallationDirectory?: boolean

  /**
   * Whether to create desktop shortcut.
   * @default true
   */
  readonly createDesktopShortcut?: boolean

  /**
   * *one-click installer only.* Run application after finish.
   * @default true
   */
  readonly runAfterFinish?: boolean

  /**
   * The path to installer icon, relative to the the [build resources](https://github.com/electron-userland/electron-builder/wiki/Options#MetadataDirectories-buildResources) or to the project directory.
   * Defaults to `build/installerIcon.ico` or application icon.
   */
  readonly installerIcon?: string | null

  /**
   * The path to uninstaller icon, relative to the the [build resources](https://github.com/electron-userland/electron-builder/wiki/Options#MetadataDirectories-buildResources) or to the project directory.
   * Defaults to `build/uninstallerIcon.ico` or application icon.
   */
  readonly uninstallerIcon?: string | null

  /**
   * *assisted installer only.* `MUI_HEADERIMAGE`, relative to the the [build resources](https://github.com/electron-userland/electron-builder/wiki/Options#MetadataDirectories-buildResources) or to the project directory.
   * @default build/installerHeader.bmp
   */
  readonly installerHeader?: string | null

  /**
   * *assisted installer only.* `MUI_WELCOMEFINISHPAGE_BITMAP`, relative to the the [build resources](https://github.com/electron-userland/electron-builder/wiki/Options#MetadataDirectories-buildResources) or to the project directory.
   * Defaults to `build/installerSidebar.bmp` or `${NSISDIR}\\Contrib\\Graphics\\Wizard\\nsis3-metro.bmp`
   */
  readonly installerSidebar?: string | null

  /**
   * *assisted installer only.* `MUI_UNWELCOMEFINISHPAGE_BITMAP`, relative to the the [build resources](https://github.com/electron-userland/electron-builder/wiki/Options#MetadataDirectories-buildResources) or to the project directory.
   * Defaults to `installerSidebar` option or `build/uninstallerSidebar.bmp` or `build/installerSidebar.bmp` or `${NSISDIR}\\Contrib\\Graphics\\Wizard\\nsis3-metro.bmp`
   */
  readonly uninstallerSidebar?: string | null

  /**
   * *one-click installer only.* The path to header icon (above the progress bar), relative to the the [build resources](https://github.com/electron-userland/electron-builder/wiki/Options#MetadataDirectories-buildResources) or to the project directory.
   * Defaults to `build/installerHeaderIcon.ico` or application icon.
   */
  readonly installerHeaderIcon?: string | null

  /**
   * The installer languages (e.g. `en_US`, `de_DE`). Change only if you understand what do you do and for what.
   */
  readonly installerLanguages?: Array<string> | string | null

  /**
   * Whether to display a language selection dialog. Not recommended (by default will be detected using OS language).
   * @default false
   */
  readonly displayLanguageSelector?: boolean

  /**
   * The path to NSIS include script to customize installer. Defaults to `build/installer.nsh`. See [Custom NSIS script](https://github.com/electron-userland/electron-builder/wiki/NSIS#custom-nsis-script).
   */
  readonly include?: string | null

  /**
   * The path to NSIS script to customize installer. Defaults to `build/installer.nsi`. See [Custom NSIS script](https://github.com/electron-userland/electron-builder/wiki/NSIS#custom-nsis-script).
   */
  readonly script?: string | null

  /**
   * The path to EULA license file. Defaults to `license.txt` or `eula.txt` (or uppercase variants). In addition to `txt, `rtf` and `html` supported (don't forget to use `target="_blank"` for links).
   *
   * Multiple license files in different languages are supported — use lang postfix (e.g. `_de`, `_ru`)). For example, create files `license_de.txt` and `license_en.txt` in the build resources.
   * If OS language is german, `license_de.txt` will be displayed. See map of [language code to name](https://github.com/meikidd/iso-639-1/blob/master/src/data.js).
   *
   * Appropriate license file will be selected by user OS language.
   */
  readonly license?: string | null

  /**
   * [LCID Dec](https://msdn.microsoft.com/en-au/goglobal/bb964664.aspx), defaults to `1033`(`English - United States`).
   */
  readonly language?: string | null

  /**
   * Whether to create multi-language installer. Defaults to `unicode` option value.
   */
  readonly multiLanguageInstaller?: boolean

  /**
   * Whether to create submenu for start menu shortcut and program files directory. If `true`, company name will be used. Or string value.
   * @default false
   */
  readonly menuCategory?: boolean | string

  /**
   * The uninstaller display name in the control panel.
   * @default ${productName} ${version}
   */
  readonly uninstallDisplayName?: string

  /**
   * The [artifact file name pattern](https://github.com/electron-userland/electron-builder/wiki/Options#artifact-file-name-pattern). Defaults to `${productName} Setup ${version}.${ext}`.
   */
  readonly artifactName?: string | null

  /**
   * *one-click installer only.* Whether to delete app data on uninstall.
   * @default false
   */
  readonly deleteAppDataOnUninstall?: boolean

  /**
   * Whether to pack the elevate executable (required for electron-updater if per-machine installer used or can be used in the future). Ignored if `perMachine` is set to `true`.
   * @default true
   */
  readonly packElevateHelper?: boolean

  /**
   * @private
   * @default false
   */
  readonly differentialPackage?: boolean

  /**
   * The name that will be used for all shortcuts. Defaults to the application name.
   */
  readonly shortcutName?: string | null
}

/**
 * Portable specific options.
 */
export interface PortableOptions extends TargetSpecificOptions, CommonNsisOptions {
  /**
   * The [requested execution level](http://nsis.sourceforge.net/Reference/RequestExecutionLevel) for Windows.
   * @default user
   */
  readonly requestExecutionLevel?: "user" | "highest" | "admin"
}

/**
 * Web Installer specific options.
 */
export interface NsisWebOptions extends NsisOptions {
  /**
   * The application package download URL. Optional — by default computed using publish configuration.
   *
   * URL like `https://example.com/download/latest` allows web installer to be version independent (installer will download latest application package).
   * Please note — it is [full URL](https://github.com/electron-userland/electron-builder/issues/1810#issuecomment-317650878).
   *
   * Custom `X-Arch` http header is set to `32` or `64`.
   */
  readonly appPackageUrl?: string | null

  /**
   * The [artifact file name pattern](https://github.com/electron-userland/electron-builder/wiki/Options#artifact-file-name-pattern). Defaults to `${productName} Web Setup ${version}.${ext}`.
   */
  readonly artifactName?: string | null
}