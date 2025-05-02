import {
  useEffect,
  useState,
  useRef,
  KeyboardEvent,
  memo,
  useMemo,
} from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button,
  Card,
  Title3,
  Text,
  makeStyles,
  tokens,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Subtitle1,
  Divider,
  ProgressBar,
} from "@fluentui/react-components";

// Type for QSys version
interface QSysVersion {
  name: string;
  path: string;
  exe_type: string;
}

// Custom styles using Fluent UI
const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    boxSizing: "border-box",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: tokens.spacingVerticalS,
  },
  logo: {
    width: "32px",
    height: "32px",
    marginRight: tokens.spacingHorizontalM,
  },
  title: {
    margin: 0,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },
  subtitle: {
    marginBottom: tokens.spacingVerticalS,
  },
  versionsList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    overflow: "auto",
    flex: 1,
    padding: tokens.spacingVerticalXS,
    willChange: "transform", // Hardware acceleration hint
  },
  versionItem: {
    display: "flex",
    flexDirection: "column",
    padding: tokens.spacingVerticalS,
    cursor: "pointer",
    transition: "all 0.1s ease",
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2,
      borderColor: tokens.colorNeutralStroke1Hover,
    },
    ":focus-visible": {
      outline: `2px solid ${tokens.colorCompoundBrandStroke}`,
      outlineOffset: "2px",
    },
  },
  versionName: {
    fontWeight: "600",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  versionType: {
    color: tokens.colorNeutralForeground2,
    fontSize: "12px",
    display: "none", // Hide the version type since we only show Designer
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalM,
  },
  footer: {
    marginTop: tokens.spacingVerticalS,
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
  },
  launchingDialog: {
    textAlign: "center",
    paddingTop: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalL,
  },
});

// Memoized version item component for better performance
const VersionItem = memo(
  ({
    version,
    index,
    isSelected,
    onClick,
    onKeyDown,
    setRef,
  }: {
    version: QSysVersion;
    index: number;
    isSelected: boolean;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
    setRef: (el: HTMLDivElement | null) => void;
  }) => {
    const styles = useStyles();

    return (
      <div
        ref={setRef}
        className={styles.versionItem}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={0}
        style={{
          backgroundColor: isSelected
            ? tokens.colorNeutralBackground2
            : undefined,
          borderColor: isSelected ? tokens.colorCompoundBrandStroke : undefined,
        }}
      >
        <span className={styles.versionName}>{version.name}</span>
        <span className={styles.versionType}>{version.exe_type}</span>
      </div>
    );
  }
);

function App() {
  const [versions, setVersions] = useState<QSysVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [launching, setLaunching] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const versionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const styles = useStyles();

  // Preload the logo image
  useEffect(() => {
    const img = new Image();
    img.src = "/icon-small.png";
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        appWindow.close();
      }
      if (e.key === "Enter" && selectedVersion !== null) {
        launchSelectedVersion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedVersion]);

  // Get installed versions on component mount - optimized with loading state cleanup
  useEffect(() => {
    let isMounted = true;

    const getVersions = async () => {
      try {
        setLoading(true);
        // Get versions from backend - already sorted in descending order
        const installedVersions = await invoke<QSysVersion[]>(
          "get_installed_versions"
        );

        if (!isMounted) return;

        setVersions(installedVersions);

        // Auto-select the first version (which is the newest)
        if (installedVersions.length > 0) {
          setSelectedVersion(0);
        }

        // Check if we have a file path argument
        try {
          const args = await appWindow.onceReady();
          if (!isMounted) return;

          if (args && args.payload && typeof args.payload === "string") {
            setFilePath(args.payload);
          }
        } catch (e) {
          console.error("Failed to get file path:", e);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(`${err}`);
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getVersions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Focus on selected version when it changes - with requestAnimationFrame for smoothness
  useEffect(() => {
    if (selectedVersion !== null && versionRefs.current[selectedVersion]) {
      requestAnimationFrame(() => {
        versionRefs.current[selectedVersion]?.focus();
      });
    }
  }, [selectedVersion]);

  // Launch selected application - memoized to avoid recreation on renders
  const launchSelectedVersion = useMemo(
    () => async () => {
      if (selectedVersion === null) return;

      try {
        setLaunching(true);
        await invoke("launch_application", {
          path: versions[selectedVersion].path,
          filePath,
        });

        // Close the app after launching with a slight delay
        setTimeout(() => appWindow.close(), 500); // Reduced timeout for faster UX
      } catch (err) {
        setError(`Failed to launch application: ${err}`);
        console.error(err);
        setLaunching(false);
      }
    },
    [selectedVersion, versions, filePath]
  );

  // Handle keyboard navigation - memoized for performance
  const createKeyDownHandler =
    (index: number) => (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (index < versions.length - 1) {
            setSelectedVersion(index + 1);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (index > 0) {
            setSelectedVersion(index - 1);
          }
          break;
        case "Enter":
          e.preventDefault();
          launchSelectedVersion();
          break;
      }
    };

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
      <div className={styles.container}>
        <header className={styles.header}>
          <img src="/icon-small.png" alt="QSC Q-Sys" className={styles.logo} />
          <Title3 className={styles.title}>Q-Sys Launcher</Title3>
        </header>

        <div className={styles.content}>
          <Subtitle1 className={styles.subtitle}>
            {filePath
              ? `Select version to open file:`
              : `Select Designer version to launch:`}
          </Subtitle1>

          {filePath && (
            <Text
              style={{
                marginBottom: tokens.spacingVerticalS,
                fontSize: "13px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {filePath}
            </Text>
          )}

          <Divider />

          {loading ? (
            <div
              style={{ padding: tokens.spacingVerticalL, textAlign: "center" }}
            >
              <ProgressBar />
              <Text style={{ marginTop: tokens.spacingVerticalM }}>
                Scanning for installed versions...
              </Text>
            </div>
          ) : error ? (
            <Text
              style={{
                color: tokens.colorPaletteRedForeground1,
                padding: tokens.spacingVerticalM,
              }}
            >
              {error}
            </Text>
          ) : (
            <div className={styles.versionsList}>
              {versions.length === 0 ? (
                <Text style={{ padding: tokens.spacingVerticalM }}>
                  No Q-Sys Designer installations found.
                </Text>
              ) : (
                versions.map((version, index) => (
                  <VersionItem
                    key={version.path}
                    version={version}
                    index={index}
                    isSelected={selectedVersion === index}
                    onClick={() => {
                      setSelectedVersion(index);
                      launchSelectedVersion();
                    }}
                    onKeyDown={createKeyDownHandler(index)}
                    setRef={(el) => (versionRefs.current[index] = el)}
                  />
                ))
              )}
            </div>
          )}

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={() => appWindow.close()}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={launchSelectedVersion}
              disabled={selectedVersion === null || launching}
            >
              Launch
            </Button>
          </div>
        </div>

        <footer className={styles.footer}>
          <Text>QSC Q-Sys Launcher v1.0</Text>
        </footer>
      </div>

      {launching && (
        <Dialog open={launching}>
          <DialogSurface>
            <DialogBody className={styles.launchingDialog}>
              <ProgressBar />
              <Text style={{ marginTop: tokens.spacingVerticalM }}>
                Launching{" "}
                {selectedVersion !== null ? versions[selectedVersion].name : ""}
                ...
              </Text>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}
    </FluentProvider>
  );
}

export default App;
