import "./App.css";
import { MyForm } from "./components/myForm/MyForm";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import ruRU from "antd/locale/ru_RU";

var updateLocale = require("dayjs/plugin/updateLocale");
dayjs.extend(updateLocale);
dayjs.updateLocale("ru", {
  weekStart: 1,
});

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <div className="App">
        <MyForm></MyForm>
      </div>
    </ConfigProvider>
  );
}

export default App;
