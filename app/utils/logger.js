import chalk from "chalk";
import browserInstance from "../browserInstance.js";

const injectLogMessages = async logs => {
  if (!browserInstance.self.isConnected()) return;
  await browserInstance.page.evaluate(logs => {
    let container = document.querySelector(`.log-list`);
    if (!container) {
      const containerStyles = document.createElement("style");
      containerStyles.textContent = `
        .log-list {
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.63);
          font-size: 0.9em;
          width: 550px;
          height: 350px;
          overflow-y: scroll;
          z-index: 99999;
          padding: 15px;
        }
        
        .log-message {
        
        }
        
        .log-message-error {
          color: #ff4e4e;
          padding-left: 10px;
        }
        
        .log-message-success {
          color: #5bff5b;
          padding-left: 10px;
        }
        
        .log-message-info {
          color: #bfbfbf;
          padding-left: 10px;
        }
        
        .log-message-title {
          color: #45ffe5;
        }
      `;
      document.head.appendChild(containerStyles);

      const containerElement = document.createElement("div");
      containerElement.classList.add("log-list");
      document.body.appendChild(containerElement);
      container = document.querySelector(`.log-list`);
    }

    container.innerHTML = logs
      .map(logItem => `<div class="log-message log-message-${logItem.type}">${logItem.message}</div>`)
      .join("");

    container.scrollTop = container.scrollHeight;
  }, logs);
};

const makeLogger = () => {
  const logs = [];

  return {
    async writeTitle(message) {
      const logItem = { type: "title", message: `\r\n➣ ${message} ` };
      logs.push(logItem);
      await injectLogMessages(logs);
      console.log(chalk.magenta.bold(logItem.message));
    },

    async writeInfo(message) {
      const logItem = { type: "info", message: `  ⮡ ${message} ` };
      logs.push(logItem);
      await injectLogMessages(logs);
      console.log(chalk.cyan.bold(logItem.message));
    },

    async writeSuccess(message) {
      const logItem = { type: "success", message: `  ⮡ ${message} ` };
      logs.push(logItem);
      await injectLogMessages(logs);
      console.log(chalk.green.bold(logItem.message));
    },

    async writeError(message) {
      const logItem = { type: "error", message: `  🔥 Произошла ошибка: \n  ⮡ ྾ ${message} ` };
      logs.push(logItem);
      await injectLogMessages(logs);
      console.log(chalk.red.bold(logItem.message));
    },
  };
};

const logger = makeLogger();

export const writeInfo = logger.writeInfo;
export const writeTitle = logger.writeTitle;
export const writeError = logger.writeError;
export const writeSuccess = logger.writeSuccess;
