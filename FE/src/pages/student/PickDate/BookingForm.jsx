import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button, TextField, MenuItem, Select } from "@mui/material";

export default function BookingForm() {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      date: null,
      package: "",
      notes: "",
      email: "",
      phone: ""
    }
  });
  
  const [existingBookings, setExistingBookings] = useState([
    new Date("2025-02-20T14:00:00"),
    new Date("2025-02-21T10:00:00")
  ]);

  const servicePackages = [
    "Basic Support",
    "Premium Support",
    "Enterprise Support"
  ];

  const isTimeConflict = (newDate) => {
    return existingBookings.some(
      (booking) => Math.abs(newDate - booking) < 3600000 // 1 hour buffer
    );
  };

  const onSubmit = (data) => {
    if (isTimeConflict(data.date)) {
      alert("This time slot is already booked. Please choose another.");
      return;
    }
    const bookingData = {
      ...data,
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss")
    };
    console.log("Mock Booking Data:", bookingData);
    alert("Booking request submitted! Check console for mock data.");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", background: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>Book a Service</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "16px" }}>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DayPicker
                selected={field.value}
                onSelect={(date) => setValue("date", date)}
              />
            )}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Controller
            control={control}
            name="package"
            render={({ field }) => (
              <Select fullWidth {...field} displayEmpty required>
                <MenuItem value="" disabled>Select a package</MenuItem>
                {servicePackages.map((pkg) => (
                  <MenuItem key={pkg} value={pkg}>{pkg}</MenuItem>
                ))}
              </Select>
            )}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Controller
            control={control}
            name="notes"
            render={({ field }) => (
              <TextField label="Notes" multiline rows={3} fullWidth {...field} />
            )}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField label="Email" type="email" fullWidth required {...field} />
            )}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <TextField label="Phone Number" type="tel" fullWidth required {...field} />
            )}
          />
        </div>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Booking
        </Button>
      </form>
    </div>
  );
}
