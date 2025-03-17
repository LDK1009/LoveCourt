// utils 폴더는 Typescript 모듈들이 그룹화된 폴더입니다.
export function breakByDot(text: string){
    return text.split(/(?<=\.)/)
}