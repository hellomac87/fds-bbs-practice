# FDS 게시판 프로젝트 템플릿

[Glitch 게시판 서버](https://glitch.com/edit/#!/fds-json-server-bbs)를 이용해 실습을 진행합니다.

이 프로젝트를 통해 알아볼 내용은 다음과 같습니다.

- [Parcel에서 환경변수 사용하기](https://en.parceljs.org/env.html)
- [json-server에 내장된 여러 기능](https://github.com/typicode/json-server#routes)
- [URLSearchParams](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams)
- [Axios에서 URLSearchParams 사용하기](https://github.com/axios/axios#request-config)

## npm 명령

- `npm install` - 프로젝트 실행에 필요한 파일을 설치하는 명령. 프로젝틑 최초 실행 시 반드시 실행해주어야 합니다.
- `npm start` - 개발용 서버를 실행시키는 명령
- `npm run build` - Netlify 등의 호스팅 서비스에서 사용할 수 있는 HTML, CSS, JS 파일을 생성해주는 명령. `dist` 폴더에 파일이 생성됩니다.

## 저장소 복사하기

**Github의 fork 기능으로는 계정 당 저장소 하나밖에 복사하지 못합니다.** Fork 기능을 사용하지 않고 프로젝트를 복사하려면, 아래의 절차대로 해 주세요.

1. 복사하고 싶은 저장소를 `git clone` 명령을 사용해 내려받는다.
1. 내려받은 폴더로 이동한 후, `rm -rf .git` 명령을 실행한다.
1. `git init`, `git add .`, `git commit -m "..."` 명령을 차례로 실행한다. (저장소 초기화)
1. Github에서 새 저장소를 만든 후, 위에서 초기화한 저장소를 푸시한다.
# fds-bbs-practice
