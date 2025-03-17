import { Button, styled, Typography } from "@mui/material";
import Link from "next/link";

export const CommonButton = styled(Button)`
  width: 100%;
  box-shadow: none;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  &:hover {
    box-shadow: none;
  }
`;

export const CommonLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.palette.gray[900]};
`;

export const CommonGrayTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.gray[400]};
`;
