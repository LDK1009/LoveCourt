import { deleteUser, signOut } from "@/service/auth";
import { useAuthStore } from "@/store";
import { CommonButton } from "@/styles/CommonComponents";
import { mixinFlex } from "@/styles/mixins";
import { styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const ButtonGroup = () => {
  // Store
  const { initUser, user } = useAuthStore();

  //   Hooks
  const router = useRouter();

  // Fuction
  async function handleSignOut() {
    const { error } = await signOut();
    if (!error) {
      enqueueSnackbar("로그아웃 성공", { variant: "info" });
      initUser();
      router.push("/");
    } else {
      enqueueSnackbar("로그아웃 실패", { variant: "error" });
    }
  }

  async function handleDeleteUser() {
    const isConfirm = confirm("정말로 회원탈퇴 하시겠어요?");
    if (isConfirm) {
      const { error: signOutError } = await signOut();
      const { error: deleteUserError } = await deleteUser(user.uid);

      // 에러 검증
      if (!deleteUserError) {
        enqueueSnackbar("회원탈퇴 성공", { variant: "info" });
        initUser();
        router.push("/");
      } else {
        if (signOutError) {
          enqueueSnackbar("로그아웃 실패", { variant: "error" });
        }
        enqueueSnackbar("회원탈퇴 실패", { variant: "error" });
      }
    }
  }

  return (
    <Container>
      <SignOutButton variant="contained" onClick={handleSignOut}>
        로그아웃
      </SignOutButton>
      <SignOutButton variant="outlined" onClick={handleDeleteUser}>
        회원탈퇴
      </SignOutButton>
    </Container>
  );
};

export default ButtonGroup;

const Container = styled("div")`
  ${mixinFlex("column")};
  width: 100%;
  row-gap: 8px;
`;

const SignOutButton = styled(CommonButton)`
  width: 100%;
`;
