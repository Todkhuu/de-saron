export default function getAppointmentDateTime(app: {
  date: string | Date;
  time: string;
}) {
  const dateString =
    typeof app.date === "string"
      ? app.date.split("T")[0]
      : app.date instanceof Date
      ? app.date.toISOString().split("T")[0]
      : "";

  return new Date(`${dateString}T${app.time}:00`);
}
