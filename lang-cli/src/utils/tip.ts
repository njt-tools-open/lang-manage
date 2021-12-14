const witchPrefix = (type: string) => `[LANG CLI: ${type}]`;

class Tip {
  private log = (type: string, text: any) => {
    console.log(witchPrefix(type), text);
  };

  public error = (content: any) => {
    this.log('\u001b[31mERROR\u001b[39m', content);
  };

  public success = (content: any) => {
    this.log('\u001b[31mSUCCESS\u001b[39m', content);
  };

  public info = (content: any) => {
    this.log('INFO', content);
  };
}

const tip = new Tip();

export default tip;
