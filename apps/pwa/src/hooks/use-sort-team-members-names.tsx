import { TeamMember } from "@/models/types/db";
import { useEffect, useState } from "react";

export type SortedTeamMembersNames = {
  fullName: string;
  role: string;
  department: string;
  avatar: string;
};

export const useSortTeamMembersNames = (teamMembers: TeamMember[]) => {
  const [sortedTeamMembers, setSortedTeamMembers] = useState<
    SortedTeamMembersNames[]
  >([]);

  useEffect(() => {
    if (teamMembers.length > 0) {
      const sortedMembers = teamMembers.map((member) => {
        return {
          fullName: `${member.name} ${member.lastName}`,
          role: member.role,
          department: member.department,
          avatar: member.avatar,
        };
      });
      setSortedTeamMembers(sortedMembers as SortedTeamMembersNames[]);
    }
  }, [teamMembers]);

  return { sortedTeamMembers };
};
