import { Button, Stack, styled, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CommentType } from "@/types/Comment";
import { addComment, getComments } from "@/service/cases";
import { enqueueSnackbar } from "notistack";
import { GavelOutlined, GavelRounded } from "@mui/icons-material";
import createRandomName from "@/utils/createRandomName";

interface PropsType {
  caseId: number;
}

const CommentSection = ({ caseId }: PropsType) => {
  //////////////////////////////////////// State ////////////////////////////////////////
  // 댓글 데이터
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  //////////////////////////////////////// Function ////////////////////////////////////////
  // 댓글 state 추가
  const addCommentState = (comment: CommentType) => {
    setComments([...comments, comment]);
  };

  // 댓글 불러오기
  async function fetchComments() {
    const { data, error } = await getComments(caseId);
    if (error) {
      enqueueSnackbar("댓글 불러오기 실패", { variant: "error" });
      return;
    }

    setComments(data);
  }

  // 댓글 등록
  async function handleSubmitComment() {
    // 랜덤 닉네임 생성
    const randomNickname = createRandomName();

    // 댓글이 없으면 등록 안됨
    if (!newComment.trim()) {
      enqueueSnackbar("댓글을 입력해주세요", { variant: "error" });
      return;
    }

    // 댓글 등록
    const { data: newCommentData, error } = await addComment(caseId, newComment, randomNickname);

    // 댓글 등록 실패
    if (error) {
      enqueueSnackbar("댓글 등록 실패", { variant: "error" });
      return;
    }

    // 댓글 등록 성공
    addCommentState({ comment: newCommentData[0].comment, nickname: randomNickname });

    setNewComment("");
  }

  //////////////////////////////////////// Effect ////////////////////////////////////////
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //////////////////////////////////////// Render ////////////////////////////////////////
  return (
    <Container>
      <Title variant="h5">국민참여재판</Title>

      {/* 댓글 목록 */}
      <CommentList comments={comments} />

      {/* 댓글 입력 */}
      <CommentInput value={newComment} onChange={(e) => setNewComment(e.target.value)} onSubmit={handleSubmitComment} />
    </Container>
  );
};

export default CommentSection;

//////////////////////////////////////// 하위 컴포넌트 ////////////////////////////////////////
///// 댓글 리스트
const CommentList = ({ comments }: { comments: CommentType[] }) => {
  if (comments.length === 0) {
    return <EmptyComments variant="body1">아직 댓글이 없습니다.</EmptyComments>;
  }

  return (
    <CommentsContainer>
      {comments.map((el, idx) => (
        <CommentItem key={idx} comment={el.comment} nickname={el.nickname} />
      ))}
    </CommentsContainer>
  );
};

///// 댓글 아이템 컴포넌트
const CommentItem = ({ comment, nickname }: CommentType) => {
  return (
    <CommentItemContainer>
      <CommentItemIcon />
      <CommentItemContent>
        <Typography variant="caption" color="text.secondary">
          {nickname}
        </Typography>
        <Typography variant="body2">{comment}</Typography>
      </CommentItemContent>
    </CommentItemContainer>
  );
};

///// 댓글 입력 컴포넌트
const CommentInput = ({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <CommentInputContainer>
      <CommentTextField
        placeholder="배심원님의 의견을 입력해주세요"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <SendButton variant="contained" onClick={onSubmit} startIcon={<GavelOutlined />}>
        평결
      </SendButton>
    </CommentInputContainer>
  );
};

//////////////////////////////////////// 스타일 ////////////////////////////////////////
////////// 상위 컴포넌트
const Container = styled(Stack)`
  width: 100%;
  row-gap: 8px;
`;

const Title = styled(Typography)`
  font-weight: bold;
  margin-bottom: 8px;
`;
//////////

////////// 댓글 리스트
const CommentsContainer = styled(Stack)`
  row-gap: 16px;
`;

const EmptyComments = styled(Typography)`
  text-align: center;
  font-style: italic;
  color: ${({ theme }) => theme.palette.text.secondary};
`;
//////////

////////// 댓글 아이템
const CommentItemContainer = styled(Stack)`
  position: relative;
  flex-direction: row;
  column-gap: 16px;
  align-items: center;
  border-radius: 8px;
  padding: 8px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.divider};
`;

const CommentItemIcon = styled(GavelRounded)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0.1;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const CommentItemContent = styled(Stack)``;
//////////

////////// 댓글 입력 섹션
const CommentInputContainer = styled(Stack)`
  flex-direction: row;
  column-gap: 8px;
  margin-top: 16px;
`;

const CommentTextField = styled(TextField)`
  flex: 1;

  & .MuiOutlinedInput-root {
    border-radius: 8px;

    & fieldset {
      border-color: ${({ theme }) => theme.palette.primary.main};
    }

    &:hover fieldset {
      border-color: ${({ theme }) => theme.palette.primary.main};
    }

    &.Mui-focused fieldset {
      border-color: ${({ theme }) => theme.palette.primary.main};
      border-width: 2px;
    }
  }
`;

const SendButton = styled(Button)``;
//////////
