import { injectable } from 'inversify';

@injectable()
export class ExternalContributor {
  private coreComitters: string[];

  constructor() {
    this.coreComitters = [];
    this.coreComitters.push('metlos');
    this.coreComitters.push('gorkem');
    this.coreComitters.push('nickboldt');
    this.coreComitters.push('themr0c');
    this.coreComitters.push('benoitf');
    this.coreComitters.push('gazarenkov');
    this.coreComitters.push('l0rd');
    this.coreComitters.push('sunix');
    this.coreComitters.push('davidfestal');
    this.coreComitters.push('evidolob');
    this.coreComitters.push('sparkoo');
    this.coreComitters.push('dmytro-ndp');
    this.coreComitters.push('rhopp');
    this.coreComitters.push('svor');
    this.coreComitters.push('tomgeorge');
    this.coreComitters.push('ibuziuk');
    this.coreComitters.push('ashumilova');
    this.coreComitters.push('skabashnyuk');
    this.coreComitters.push('azatsarynnyy');
    this.coreComitters.push('vparfonov');
    this.coreComitters.push('musienko-maxim');
    this.coreComitters.push('slemeur');
    this.coreComitters.push('tolusha');
    this.coreComitters.push('mshaposhnik');
    this.coreComitters.push('vitaliy-guliy');
    this.coreComitters.push('vzhukovs');
    this.coreComitters.push('vkuznyetsov');
    this.coreComitters.push('artaleks9');
    this.coreComitters.push('mkuznyetsov');
    this.coreComitters.push('sleshchenko');
    this.coreComitters.push('ericwill');
    this.coreComitters.push('olexii4');
    this.coreComitters.push('rkratky');
    this.coreComitters.push('AndrienkoAleksandr');
    this.coreComitters.push('bmicklea');
    this.coreComitters.push('vinokurig');
    this.coreComitters.push('SkorikSergey');
    this.coreComitters.push('JPinkney');
    this.coreComitters.push('tsmaeder');
    this.coreComitters.push('mmorhun');
    this.coreComitters.push('amisevsk');
    this.coreComitters.push('akurinnoy');
    this.coreComitters.push('ScrewTSW');
    this.coreComitters.push('akurinnoy');
    this.coreComitters.push('Ohrimenko1988');
    this.coreComitters.push('boczkowska');
    this.coreComitters.push('Katka92');
    this.coreComitters.push('MichalMaler');
    this.coreComitters.push('flacatus');
    this.coreComitters.push('RomanNikitenko');

    // bots
    this.coreComitters.push('che-bot');
    this.coreComitters.push('dependabot');
    this.coreComitters.push('dependabot-preview');
  }

  public async isExternal(login: string): Promise<boolean> {
    return !this.coreComitters.includes(login);
  }
}
