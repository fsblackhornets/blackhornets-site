import { useMemo, useState } from "react";
import type { TeamKey } from "@/components/pagecomponents/team/constants";
import type { TeamData, TeamMember } from "@/types/team";

interface State {
	selectedTeam: TeamKey | null;
	selectedDepartment: string | null;
	selectedMember: TeamMember | null;
}

export function useTeamState(data: TeamData) {
	const [state, setState] = useState<State>({
		selectedTeam: null,
		selectedDepartment: null,
		selectedMember: null,
	});

	const filteredMembers = useMemo(() => {
		if (!state.selectedTeam) return [];
		const teamMembers = data.organized_data[state.selectedTeam] ?? [];
		if (!state.selectedDepartment) return teamMembers;
		return teamMembers.filter((m) => m.department === state.selectedDepartment);
	}, [data, state.selectedTeam, state.selectedDepartment]);

	const selectTeam = (team: TeamKey, department?: string) =>
		setState((s) => ({
			...s,
			selectedTeam: team,
			selectedDepartment: department ?? null,
		}));

	const goBack = () =>
		setState((s) => ({ ...s, selectedTeam: null, selectedDepartment: null }));

	const openMember = (member: TeamMember) =>
		setState((s) => ({ ...s, selectedMember: member }));

	const closeMember = () => setState((s) => ({ ...s, selectedMember: null }));

	return {
		selectedTeam: state.selectedTeam,
		selectedDepartment: state.selectedDepartment,
		selectedMember: state.selectedMember,
		filteredMembers,
		selectTeam,
		goBack,
		openMember,
		closeMember,
	};
}
