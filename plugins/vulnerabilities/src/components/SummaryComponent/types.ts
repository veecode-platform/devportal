import { RepoVulnerability } from "../../utils/types";

export interface SummaryProps {
  value: RepoVulnerability[] | undefined;
  loading: boolean;
};