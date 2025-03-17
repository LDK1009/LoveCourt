import { CommonGrayTypography } from "@/styles/CommonComponents";
import { mixinFlex } from "@/styles/mixins";
import { styled, Typography } from "@mui/material";
import Image from "next/image";

interface PropsType {
  imgSrc: string;
  nickname: string;
}

const Header = ({ imgSrc, nickname }: PropsType) => {
  return (
    <Container>
      <CommonGrayTypography variant="body1" fontWeight={"bold"}>
        프로필
      </CommonGrayTypography>
      <ProfileWrap>
        <ProfileImg src={imgSrc} alt="" width={50} height={50} />
        <Typography variant="body1">{nickname}</Typography>
      </ProfileWrap>
    </Container>
  );
};

export default Header;

const Container = styled("div")`
  ${mixinFlex("column")};
  align-items: start;
  justify-content: start;
  row-gap: 8px;
`;

const ProfileWrap = styled("div")`
  ${mixinFlex("row")};
  justify-content: start;
  column-gap: 16px;
`;
const ProfileImg = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 100%;
`;
