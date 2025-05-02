import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  makeStyles,
  tokens,
  shorthands,
  Button,
  Spinner,
  Text,
  Badge,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  useId,
  mergeClasses,
} from "@fluentui/react-components";

// Type for QSys version
interface QSysVersion {
  name: string;
  path: string;
  exe_type: string;
}

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
    fontSize: "12px",
    fontFamily: "monospace",
    wordBreak: "break-all",
    marginBottom: "16px",
    maxHeight: "40px",
    overflow: "auto",
    color: tokens.colorNeutralForeground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  content: {
    flex: "1 1 auto",
    overflowY: "auto",
    ...shorthands.padding("4px", "4px", "8px", "0"),
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    minHeight: "200px", // Ensure minimum height for content area
  },
  versionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
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

function App() {
  const [versions, setVersions] = useState<QSysVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const styles = useStyles();
  const messageId = useId("message");

  // Get installed versions on component mount
  useEffect(() => {
    const getVersions = async () => {
      try {
        setLoading(true);

        // Get installed Q-Sys Designer versions (already sorted)
        const installedVersions = await invoke<QSysVersion[]>(
          "get_installed_versions"
        );

        setVersions(installedVersions);

        // Auto-select first version if available (which is now the newest one)
        if (installedVersions.length > 0) {
          setSelectedVersion(installedVersions[0].path);
        }
      } catch (err) {
        setError(`Failed to get installed versions: ${err}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getVersions();
  }, []);

  // Launch selected application
  const launchApplication = async (path: string) => {
    try {
      setLoading(true);
      await invoke("launch_application", {
        path,
        filePath,
      });
      // Will be closed by backend
    } catch (err) {
      setError(`Failed to launch application: ${err}`);
      console.error(err);
      setLoading(false);
    }
  };

  // Launch the selected version
  const handleLaunch = () => {
    if (selectedVersion) {
      launchApplication(selectedVersion);
    }
  };

  // Close the application
  const handleCancel = async () => {
    try {
      await invoke("close_window");
    } catch (err) {
      console.error("Failed to close window:", err);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedVersion) {
      handleLaunch();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={styles.container}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make div focusable for keyboard events
    >
      <div className={styles.header}>
        <Text className={styles.headerTitle}>QSC Q-Sys Launcher</Text>
        <Text className={styles.headerSubtitle}>
          Select the Designer version to{" "}
          {filePath ? "open file with" : "launch"}:
        </Text>

        {filePath && (
          <div className={styles.filePath} title={filePath}>
            {filePath}
          </div>
        )}
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spinner size="small" label="Loading versions..." />
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <MessageBar id={messageId} intent="error">
              <MessageBarBody>
                <MessageBarTitle>Error</MessageBarTitle>
                {error}
              </MessageBarBody>
            </MessageBar>
          </div>
        ) : (
          <>
            {versions.length === 0 ? (
              <div className={styles.noVersionsContainer}>
                <Text>No QSC Designer versions found on this computer.</Text>
              </div>
            ) : (
              <div className={styles.versionsList}>
                {versions.map((version) => (
                  <div
                    key={version.path}
                    className={mergeClasses(
                      styles.versionButton,
                      selectedVersion === version.path &&
                        styles.versionButtonSelected
                    )}
                    onClick={() => setSelectedVersion(version.path)}
                    tabIndex={0} // Make focusable for keyboard navigation
                    role="button"
                    aria-selected={selectedVersion === version.path}
                  >
                    <div className={styles.versionName}>{version.name}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.footer}>
        <Button
          appearance="secondary"
          onClick={handleCancel}
          className={styles.actionButton}
        >
          Cancel
        </Button>
        <Button
          appearance="primary"
          onClick={handleLaunch}
          disabled={!selectedVersion || loading}
          className={styles.actionButton}
        >
          Launch
        </Button>
      </div>
    </div>
  );
}

export default App;
