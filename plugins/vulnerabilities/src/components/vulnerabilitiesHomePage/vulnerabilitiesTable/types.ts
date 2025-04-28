import { RepoVulnerability } from "../../../utils/types";

export interface VulnerabilityTableProps {
  value: RepoVulnerability[] | undefined;
  loading: boolean;
}