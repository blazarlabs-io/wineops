/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SortedTeamMembersNames,
  useSortTeamMembersNames,
} from "@/hooks/use-sort-team-members-names";
import { TeamMember } from "@/models/types/db";
import {
  Autocomplete,
  Avatar,
  Chip,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

export type ResponsibleTeamMemberFieldProps = {
  teamMembers: TeamMember[];
  onChange: (value: any) => void;
};

export default function ResponsibleTeamMemberField({
  teamMembers,
  onChange,
}: ResponsibleTeamMemberFieldProps) {
  const { sortedTeamMembers } = useSortTeamMembersNames(teamMembers);
  const [value, setValue] = useState<string | null>(null);

  const handleChange = useCallback((event: any, newValue: any) => {
    setValue(newValue);
    onChange(newValue);
  }, []);

  const handleRenderOption = useCallback(
    (props: { [x: string]: any; key: any }, option: string) => {
      const { key, ...optionProps } = props;
      console.log("option", option);
      console.log(key, optionProps);
      const selectedMember: SortedTeamMembersNames[] = sortedTeamMembers.filter(
        (member) => member?.fullName.includes(option)
      );
      //   setValue(selectedMember[0]?.fullName);
      return (
        <Grid key={key} container spacing={2} columns={10} {...optionProps}>
          <Grid size={1}>
            <Avatar
              sx={{ width: 24, height: 24, fontSize: "0.875rem" }}
              src={selectedMember[0]?.avatar}
            >
              {selectedMember[0]?.fullName.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid size={4}>
            <Typography sx={{ fontSize: "0.875rem" }} className="truncate">
              {selectedMember[0]?.fullName}
            </Typography>
          </Grid>
          <Grid size={2}>
            <Typography
              color="textSecondary"
              sx={{ fontSize: "0.875rem" }}
              className="italic"
            >
              {selectedMember[0]?.department}
            </Typography>
          </Grid>
          <Grid size={3}>
            <Chip
              label={selectedMember[0]?.role}
              size="small"
              variant="outlined"
            />
          </Grid>
        </Grid>
      );
    },
    [sortedTeamMembers]
  );

  return (
    <Autocomplete
      id="responsible-team-member-field"
      options={sortedTeamMembers.map((member) => member?.fullName)}
      value={value}
      // freeSolo
      filterSelectedOptions
      renderOption={handleRenderOption}
      renderInput={(params) => (
        <TextField {...params} label="Responsible person" />
      )}
      onChange={handleChange}
    />
  );
}
