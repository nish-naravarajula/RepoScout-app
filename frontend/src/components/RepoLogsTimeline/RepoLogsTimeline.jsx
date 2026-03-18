import "./RepoLogsTimeline.css";
import RepoLogsDropdown from "../RepoLogsDropdown/RepoLogsDropdown.jsx";

function RepoLogsTimeline({ logs, setLogs }) {
  function groupLogsByDate(logList) {
    const groupedLogs = {};

    for (let i = 0; i < logList.length; i++) {
      const currentLog = logList[i];
      const date = new Date(currentLog.date);

      const dateKey = date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      if (!groupedLogs[dateKey]) {
        groupedLogs[dateKey] = [];
      }

      groupedLogs[dateKey].push(currentLog);
    }

    return groupedLogs;
  }

  function sortGroupedDates(groupedLogs) {
    return Object.keys(groupedLogs).sort((dateA, dateB) => {
      return new Date(dateB) - new Date(dateA);
    });
  }

  function sortLogsByTime(logList) {
    return [...logList].sort((logA, logB) => {
      return new Date(logB.date) - new Date(logA.date);
    });
  }

  function handleUpdateLog(updatedLog) {
    setLogs((prevLogs) => {
      return prevLogs.map((currentLog) => {
        if (currentLog._id === updatedLog._id) {
          return updatedLog;
        }

        return currentLog;
      });
    });
  }

  function handleDeleteLog(deletedLogId) {
    setLogs((prevLogs) => {
      return prevLogs.filter((currentLog) => {
        return currentLog._id !== deletedLogId;
      });
    });
  }

  const groupedLogs = groupLogsByDate(logs);
  const sortedDates = sortGroupedDates(groupedLogs);

  return (
    <div className="log-timeline">
      {sortedDates.map((dateKey) => {
        const sortedLogs = sortLogsByTime(groupedLogs[dateKey]);

        return (
          <div key={dateKey} className="log-day-section">
            <div className="log-day-header">
              <div className="log-day-line"></div>
              <h3 className="log-day-title">{dateKey}</h3>
            </div>

            {sortedLogs.map((log) => {
              return (
                <RepoLogsDropdown
                  key={log._id}
                  log={log}
                  onUpdateLog={handleUpdateLog}
                  onDeleteLog={handleDeleteLog}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default RepoLogsTimeline;
