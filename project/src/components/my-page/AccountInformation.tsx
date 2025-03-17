import { CommonGrayTypography } from "@/styles/CommonComponents";
import { mixinFlex } from "@/styles/mixins";
import { styled } from "@mui/material";

interface PropsType {
  items: ItemType[];
}

type ItemType = {
  title: string;
  value: string;
};

const AccountInformation = ({ items }: PropsType) => {
  return (
    <Container>
      <CommonGrayTypography variant="body1" fontWeight={"bold"}>
        계정 정보
      </CommonGrayTypography>
      <ItemContainer>
        {items?.map((el, idx) => {
          return (
            <ItemWrap key={idx}>
              <ItemTitle variant="body1" align="left">
                {el.title}
              </ItemTitle>
              <ItemTitle variant="body1" align="right">
                {el.value}
              </ItemTitle>
            </ItemWrap>
          );
        })}
      </ItemContainer>
    </Container>
  );
};

export default AccountInformation;

const Container = styled("div")`
  ${mixinFlex("column")};
  width: 100%;
  align-items: start;
  justify-content: start;
  row-gap: 8px;
`;

const ItemContainer = styled("div")`
  ${mixinFlex("column")};
  width: 100%;
  align-items: start;
  justify-content: start;
  row-gap: 4px;
`;

const ItemWrap = styled("div")`
  ${mixinFlex("row")};
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const ItemTitle = styled(CommonGrayTypography)`
  display: inline-block;
`;
