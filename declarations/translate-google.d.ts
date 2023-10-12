declare module 'translate-google' {
    export default function translate(
      text: string,
      options: {
        from: string;
        to: string;
      }
    ): Promise<string>;
  }
  