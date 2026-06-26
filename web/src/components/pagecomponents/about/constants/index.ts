import { BoltIcon } from "@/components/icons/BoltIcon";
import { BullhornIcon } from "@/components/icons/BullhornIcon";
import { CarIcon } from "@/components/icons/CarIcon";
import { ExcellenceIcon } from "@/components/icons/ExcellenceIcon";
import { GearIcon } from "@/components/icons/GearIcon";
import { GearsIcon } from "@/components/icons/GearsIcon";
import { GraduationCapIcon } from "@/components/icons/GraduationCapIcon";
import { HandshakeIcon } from "@/components/icons/HandshakeIcon";
import { InnovationIcon } from "@/components/icons/InnovationIcon";
import { ManagementIcon } from "@/components/icons/ManagementIcon";
import { MicrochipIcon } from "@/components/icons/MicrochipIcon";
import { SpeedIcon } from "@/components/icons/SpeedIcon";
import { TrophyIcon } from "@/components/icons/TrophyIcon";
import { UsersIcon } from "@/components/icons/UsersIcon";

export const HERO_BADGES = [
	{ Icon: SpeedIcon, label: "Speed" },
	{ Icon: InnovationIcon, label: "Innovation" },
	{ Icon: ExcellenceIcon, label: "Excellence" },
] as const;

export const STAT_ITEMS = [
	{ Icon: UsersIcon, label: "Team Members" },
	{ Icon: GraduationCapIcon, label: "Departments" },
	{ Icon: TrophyIcon, label: "Awards" },
] as const;

export const DEPARTMENTS = [
	{
		Icon: BullhornIcon,
		title: "Marketing",
		description:
			"Team promotion, content creation, and social media management.",
	},
	{
		Icon: HandshakeIcon,
		title: "Sponsorships",
		description:
			"Partner communication, negotiations, and sponsor relationship management.",
	},
	{
		Icon: ManagementIcon,
		title: "Management",
		description:
			"Team organization, project coordination, and resource management.",
	},
	{
		Icon: CarIcon,
		title: "Chassis & Aerodynamics",
		description:
			"Chassis design, structural analysis, and aerodynamic optimization.",
	},
	{
		Icon: GearIcon,
		title: "Suspension & Steering",
		description: "Suspension systems, steering geometry, and vehicle dynamics.",
	},
	{
		Icon: GearsIcon,
		title: "Transmission & Braking",
		description: "Drivetrain components, braking systems, and power delivery.",
	},
	{
		Icon: BoltIcon,
		title: "High Voltage",
		description:
			"Battery systems, high voltage distribution, and energy management.",
	},
	{
		Icon: MicrochipIcon,
		title: "Low Voltage",
		description:
			"Control electronics, sensors, CAN communication, and low voltage systems.",
	},
] as const;
