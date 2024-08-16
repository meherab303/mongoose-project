import { TSchedule } from "./offeredCourse.interface";

export const hasTimeConflict = (
  assignSchedule: TSchedule[],
  startTime: string,
  endTime: string
) => {
  for (const schedule of assignSchedule) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${startTime}`);
    const newEndTime = new Date(`1970-01-01T${endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};
