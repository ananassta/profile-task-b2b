import { useState, useRef, useEffect } from "react";
import { Select, DatePicker, Input, Typography, Button, Form } from "antd";
import dayjs from "dayjs";

import { ReactComponent as SuccessImage } from "./success.svg";
import styles from "./MyForm.module.css";

export const MyForm = () => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [submitionAlert, setSubmitionAlert] = useState({ opacity: "0" });

  const { RangePicker } = DatePicker;
  const { Title, Text } = Typography;
  const { TextArea } = Input;

  // Buttons functions
  const onFinish = (values) => {
    const res = { ...values };
    const dateRange = {
      start: values.dateRange[0].$d,
      end: values.dateRange[1].$d,
    };
    dateRange.start.setSeconds(0, 0);
    dateRange.end.setSeconds(0, 0);
    res.dateRange = dateRange;
    res.text = res.text || "";
    console.log("Success:", res);
    setSubmitionAlert({ opacity: "1" });
    setTimeout(() => setSubmitionAlert({ opacity: "0" }), 5000);
  };
  const onReset = () => {
    formRef.current?.resetFields();
  };

  // For disabling time before now
  let startDate;
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  const disabledRangeTime = (date, type) => {
    const hour = dayjs().hour();
    const minute = dayjs().minute();
    if (date !== null) {
      if (date !== null && type === "start") {
        startDate = date;
      }
      if (type === "start") {
        if (
          date.$D === dayjs().$D &&
          date.$M === dayjs().$M &&
          date.$y === dayjs().$y
        ) {
          return {
            disabledHours: () => range(0, 24).splice(0, hour),
            disabledMinutes: () => range(0, 60).splice(0, minute),
          };
        }
        return {
          disabledHours: () => range(0, 24).splice(0, 0),
          disabledMinutes: () => range(0, 60).splice(0, 0),
        };
      }
      if (startDate) {
        if (
          startDate.$D === date.$D &&
          startDate.$M === date.$M &&
          startDate.$y === date.$y
        ) {
          return {
            disabledHours: () => range(0, 24).splice(0, hour),
            disabledMinutes: () => range(0, 60).splice(0, minute + 1),
          };
        }
        return {
          disabledHours: () => range(0, 24).splice(0, 0),
          disabledMinutes: () => range(0, 60).splice(0, 0),
        };
      }
      return {
        disabledHours: () => range(0, 24).splice(0, 24),
        disabledMinutes: () => range(0, 60).splice(0, 60),
      };
    }
    return {
      disabledHours: () => range(0, 24).splice(0, 24),
      disabledMinutes: () => range(0, 60).splice(0, 60),
    };
  };

  // Form items options
  const floors = new Array(25).fill(1).map((a, i) => i + 3);
  const floorsSelectOptions = floors.map((elem) => {
    return { value: elem, label: elem + " этаж" };
  });
  const meetingRooms = new Array(10)
    .fill(1)
    .map((a, i) => i + 1)
    .map((elem) => {
      return { value: elem, label: "Переговорка " + elem };
    });

  useEffect(() => {
    forceUpdate({});
  }, []);

  return (
    <div className={styles.block}>
      <Title level={2} className={styles.title}>
        Форма бронирования переговорной
      </Title>
      <Form
        form={form}
        name="meetingRoomBooking"
        onFinish={onFinish}
        ref={formRef}
        className={styles.form}
      >
        <Form.Item
          name="tower"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите башню",
            },
          ]}
        >
          <Select
            id="tower"
            placeholder="Выберите башню"
            options={[
              {
                value: "A",
                label: "Башня A",
              },
              {
                value: "B",
                label: "Башня В",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="floor"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите этаж",
            },
          ]}
        >
          <Select
            id="floor"
            placeholder="Выберите этаж"
            options={floorsSelectOptions}
          />
        </Form.Item>
        <Form.Item
          name="meetingRoom"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите переговорку",
            },
          ]}
        >
          <Select
            id="meetingRoom"
            placeholder="Выберите переговорку"
            options={meetingRooms}
          />
        </Form.Item>
        <Form.Item
          name="dateRange"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите даты и время",
            },
          ]}
        >
          <RangePicker
            id="dateRange"
            placement="bottomLeft"
            showTime={{
              format: "HH:mm",
            }}
            format="DD-MM-YYYY HH:mm"
            disabledDate={(d) => d.isBefore(dayjs().startOf("day"))}
            disabledTime={disabledRangeTime}
          />
        </Form.Item>
        <Form.Item name="text">
          <TextArea id="text" rows={4} />
        </Form.Item>
        <div className={styles.formButtons}>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                shape="round"
                type="primary"
                htmlType="submit"
                // to make button disabled until entering information in all form items
                // disabled={
                //   !form.isFieldsTouched(true) ||
                //   !!form.getFieldsError().filter(({ errors }) => errors.length)
                //     .length
                // }
              >
                Отправить
              </Button>
            )}
          </Form.Item>
          <Form.Item>
            <Button shape="round" htmlType="button" onClick={onReset}>
              Очистить
            </Button>
          </Form.Item>
        </div>
      </Form>

      <div className={styles.alert} style={submitionAlert}>
        <SuccessImage />
        <Text>
          Письмо для активации аккаунта успешно отправлено на адрес электронной
          почты, который вы указали при регистрации.
        </Text>
      </div>
    </div>
  );
};
