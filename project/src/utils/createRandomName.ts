/**
 * 랜덤 닉네임 생성 유틸리티
 * 형용사와 명사를 조합하여 독특한 닉네임을 생성합니다.
 */

// 형용사 목록
const adjectives = [
  "행복한",
  "슬픈",
  "화난",
  "지친",
  "활기찬",
  "조용한",
  "시끄러운",
  "따뜻한",
  "차가운",
  "부드러운",
  "강한",
  "약한",
  "빠른",
  "느린",
  "밝은",
  "어두운",
  "현명한",
  "용감한",
  "겸손한",
  "정직한",
  "친절한",
  "엄격한",
  "귀여운",
  "멋진",
  "신비로운",
  "공정한",
  "냉철한",
  "신중한",
  "논리적인",
  "객관적인",
  "분석적인",
  "통찰력있는",
  "예리한",
  "진지한",
  "사려깊은",
  "정의로운",
  "합리적인",
  "균형잡힌",
  "엄정한",
  "철저한",
];

// 명사 목록
const nouns = ["배심원"];

/**
 * 랜덤 닉네임을 생성합니다.
 * @returns {string} 형용사와 명사가 조합된 랜덤 닉네임
 */
export const createRandomName = (): string => {
  // 랜덤 형용사 선택
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  // 랜덤 명사 선택
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  // 형용사와 명사 조합
  return `${randomAdjective} ${randomNoun}`;
};

/**
 * 숫자를 포함한 랜덤 닉네임을 생성합니다.
 * @param {boolean} includeNumber 숫자 포함 여부 (기본값: false)
 * @returns {string} 랜덤 닉네임 (선택적으로 숫자 포함)
 */
export const createRandomNameWithNumber = (includeNumber: boolean = false): string => {
  const baseName = createRandomName();

  if (includeNumber) {
    // 1부터 999 사이의 랜덤 숫자 생성
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    return `${baseName} ${randomNumber}`;
  }

  return baseName;
};

export default createRandomName;
