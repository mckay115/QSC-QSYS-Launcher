import { useEffect, useState, useCallback, memo } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  makeStyles,
  tokens,
  shorthands,
  Button,
  Spinner,
  Text,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  useId,
  mergeClasses,
} from "@fluentui/react-components";

// Public folder assets (served at root path)
const iconSmall = "/img/icon-small.png";
const iconLarge = "/img/icon.png";

// Type for QSys version
interface QSysVersion {
  name: string;
  path: string;
  exe_type: string;
}

// Type for file info from backend
interface FileInfo {
  path: string;
  version: string | null;
}

// Helper function to extract file name without extension
const getFileNameWithoutExtension = (filePath: string): string => {
  // Extract just the file name without the directory path
  const fileName = filePath.split(/[\\/]/).pop() || "";
  // Remove the extension
  return fileName.replace(/\.[^/.]+$/, "");
};

// Helper function to check if file version matches installed version (first two numbers)
const versionsMatch = (fileVersion: string | null, installedVersionName: string): boolean => {
  if (!fileVersion) return false;
  
  // Extract first two numbers from file version (e.g., "9.13" from "9.13.1.0")
  const fileMatch = fileVersion.match(/^(\d+\.\d+)/);
  if (!fileMatch) return false;
  const filePrefix = fileMatch[1];
  
  // Check if installed version name contains this prefix
  // Installed versions are like "Q-SYS Designer 9.13" or just "9.13"
  return installedVersionName.includes(filePrefix);
};

// Custom styles using Fluent UI - Windows native styling
const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    background: tokens.colorNeutralBackground1,
    ...shorthands.padding("16px"),
    boxSizing: "border-box",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
    flexShrink: 0,
  },
  logo: {
    width: "32px",
    height: "32px",
    marginRight: "8px",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "4px",
    color: tokens.colorNeutralForeground1,
  },
  headerSubtitle: {
    fontSize: "14px",
    color: tokens.colorNeutralForeground2,
    marginBottom: "8px",
  },
  filePath: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding("8px", "12px"),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginBottom: "16px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "inline-block",
  },
  fileName: {
    fontSize: "14px",
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    display: "block",
  },
  fileVersion: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
    marginTop: "2px",
    display: "block",
  },
  versionButtonMatched: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
  },
  content: {
    flex: "1 1 auto",
    overflowY: "auto",
    ...shorthands.padding("4px", "4px", "8px", "0"),
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    minHeight: "200px", // Ensure minimum height for content area
    willChange: "transform", // Hardware acceleration hint
  },
  versionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    willChange: "transform", // Hardware acceleration hint
  },
  versionButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    textAlign: "center",
    ...shorthands.padding("12px", "16px"),
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    cursor: "pointer",
    ...shorthands.transition("all", "0.1s", "ease"),
    minHeight: "50px",
    boxSizing: "border-box",

    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      border: `1px solid ${tokens.colorNeutralStroke1Hover}`,
      boxShadow: tokens.shadow4,
    },
    ":active": {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
      transform: "scale(0.98)",
    },
  },
  versionButtonSelected: {
    borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  versionName: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: "16px",
    color: tokens.colorNeutralForeground1,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    ...shorthands.padding("12px", "0", "0", "0"),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 1 auto",
    gap: "16px",
  },
  errorContainer: {
    marginBottom: "16px",
  },
  noVersionsContainer: {
    ...shorthands.padding("24px"),
    textAlign: "center",
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    color: tokens.colorNeutralForeground2,
    margin: "auto 0",
  },
  actionButton: {
    minWidth: "80px",
  },
});

// Memoized version button component for better performance
const VersionButton = memo(
  ({
    version,
    isSelected,
    isMatched,
    onClick,
    onKeyDown,
  }: {
    version: QSysVersion;
    isSelected: boolean;
    isMatched: boolean;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  }) => {
    const styles = useStyles();

    return (
      <div
        className={mergeClasses(
          styles.versionButton,
          isSelected && styles.versionButtonSelected,
          isMatched && !isSelected && styles.versionButtonMatched
        )}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="button"
        aria-selected={isSelected}
      >
        <span className={styles.versionName}>{version.name}</span>
      </div>
    );
  }
);

function App() {
  const [versions, setVersions] = useState<QSysVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileVersion, setFileVersion] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const styles = useStyles();
  const messageId = useId("message");

  // Preload images for performance
  useEffect(() => {
    const img1 = new Image();
    img1.src = iconSmall;

    const img2 = new Image();
    img2.src = iconLarge;
  }, []);

  // Get file info from backend on mount
  useEffect(() => {
    let mounted = true;

    const getFileInfo = async () => {
      try {
        const fileInfo = await invoke<FileInfo>("get_file_info");
        console.log("Received file info:", fileInfo);
        if (mounted && fileInfo.path) {
          setFilePath(fileInfo.path);
          setFileVersion(fileInfo.version);
          console.log("Set fileVersion to:", fileInfo.version);
        }
      } catch (err) {
        console.error("Error getting file info:", err);
      }
    };

    getFileInfo();

    return () => {
      mounted = false;
    };
  }, []);

  // Get installed versions on component mount - optimized with cleanup
  useEffect(() => {
    let mounted = true;

    const getVersions = async () => {
      try {
        setLoading(true);

        // Get installed Q-Sys Designer versions (already sorted)
        const installedVersions = await invoke<QSysVersion[]>(
          "get_installed_versions"
        );

        if (!mounted) return;
        setVersions(installedVersions);

        // Auto-select matching version if there's a file version, otherwise no auto-selection
        if (installedVersions.length > 0 && fileVersion) {
          const matchingVersion = installedVersions.find(v => versionsMatch(fileVersion, v.name));
          if (matchingVersion) {
            setSelectedVersion(matchingVersion.path);
          }
        }
      } catch (err) {
        if (!mounted) return;
        setError(`Failed to get installed versions: ${err}`);
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getVersions();

    return () => {
      mounted = false;
    };
  }, []);

  // Launch selected application - memoized to prevent recreations
  const launchApplication = useCallback(
    async (path: string) => {
      try {
        await invoke("launch_application", {
          path,
          filePath,
        });

        // Close the app after successful launch
        await invoke("close_application");
      } catch (err) {
        setError(`Failed to launch: ${err}`);
        console.error(err);
      }
    },
    [filePath]
  );

  // Handle launch button click
  const handleLaunch = useCallback(() => {
    if (selectedVersion) {
      launchApplication(selectedVersion);
    }
  }, [selectedVersion, launchApplication]);

  // Handle cancel button click
  const handleCancel = useCallback(async () => {
    try {
      await invoke("close_application");
    } catch (err) {
      console.error("Failed to close application:", err);
    }
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      } else if (e.key === "Enter" && selectedVersion) {
        handleLaunch();
      }
    },
    [handleCancel, handleLaunch, selectedVersion]
  );

  // Create key handler for version item
  const createVersionKeyHandler =
    (version: QSysVersion) => (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setSelectedVersion(version.path);
        launchApplication(version.path);
      }
      handleKeyDown(e);
    };

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <img src={iconSmall} alt="QSC" className={styles.logo} />
          <span className={styles.headerTitle}>Q-Sys Launcher</span>
        </div>
        <span className={styles.headerSubtitle}>
          {filePath
            ? "Select Q-Sys Designer version to open file:"
            : "Select Q-Sys Designer version to launch:"}
        </span>

        {filePath && (
          <div className={styles.filePath}>
            <span className={styles.fileName}>{getFileNameWithoutExtension(filePath)}</span>
            {fileVersion && (
              <span className={styles.fileVersion}>Version: {fileVersion}</span>
            )}
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <MessageBar id={messageId}>
              <MessageBarBody>
                <MessageBarTitle>Error</MessageBarTitle>
                {error}
              </MessageBarBody>
            </MessageBar>
          </div>
        )}
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spinner size="medium" />
            <Text>Loading installed versions...</Text>
          </div>
        ) : versions.length === 0 ? (
          <div className={styles.noVersionsContainer}>
            <Text>No Q-Sys Designer installations found</Text>
          </div>
        ) : (
          <div className={styles.versionsList}>
            {versions.map((version) => (
              <VersionButton
                key={version.path}
                version={version}
                isSelected={selectedVersion === version.path}
                isMatched={versionsMatch(fileVersion, version.name)}
                onClick={() => {
                  setSelectedVersion(version.path);
                  launchApplication(version.path);
                }}
                onKeyDown={createVersionKeyHandler(version)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Button
          appearance="secondary"
          className={styles.actionButton}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          appearance="primary"
          className={styles.actionButton}
          disabled={!selectedVersion || loading}
          onClick={handleLaunch}
        >
          Launch
        </Button>
      </div>
    </div>
  );
}

export default App;
