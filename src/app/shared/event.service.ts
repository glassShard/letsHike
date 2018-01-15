import { Injectable } from '@angular/core';
import {EventModel} from './event-model';
import {UserService} from './user.service';

@Injectable()
export class EventService {
  private _events: EventModel[];

  constructor(private _userService: UserService) {
    this._events = [
      {
        id: 1,
        title: 'Mont Blanc csúcsmászás',
        days: 5,
        country: 'Franciaország',
        region: 'Mont Blanc csoport',
        date: '2018-08-15',
        description: 'Ehhez nagyon nincs is mit hozzátenni. Telekocsi' +
        ' rendszerben szervezzük a túrát, melyet a normál út felől' +
        ' tervezünk. Szállás a Gouter-házban, ezért kérlek, időben' +
        ' jelentkezz, mert abba a házba elég hamar fogynak a helyek!' +
        ' Magashegyi túra, ennek megfelelő felszerelés kell, ezt neked kell' +
        ' beszerezni. A túravezetésért díjat nem számolunk fel, a túra tehát' +
        ' önköltséges, viszont az autókra nemcsak benzin, hanem amortizációs' +
        ' költséget is számolunk!',
        picUrl: '../assets/montblanc.jpg',
        category: 'Magashegyi túra',
        creatorId: 2,
        guestsIds: [1, 3, 4]
      },
      {
        id: 2,
        title: 'Via Ferrata túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-05-15',
        description: 'Kora reggeli indulással tervezzük a Haid Steigen való' +
        ' felmászást a Preinerwand tetejére. Ez a ferrata D jelzésű, de' +
        ' kezdők is bevállalhatják. Ferrata felszerelés kell, egy jó' +
        ' túracipő, és egy védőkesztyű sem árt. Ez a ferrata állandóan' +
        ' zsúfolt, ezért csak türelmes emberek jelentkezését várjuk.',
        picUrl: '../assets/haidsteig.jpg',
        category: 'Via Ferrata túra',
        creatorId: 1,
        guestsIds: [2, 3]
      },
      {
        id: 3,
        title: 'Hótalpas túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-01-15',
        description: 'Hótalpas túrára invitállak benneteket. Korán reggel' +
        ' Budapestről indulunk, majd a Schneeberg lábához érünk. Itt' +
        ' felcsatoljuk hótalpainkat, és feltúrázunk a Schneeberg tetejére.' +
        ' Útközben a sípálya tetején lévő hüttében feltankolunk' +
        ' forraltborból, visszafelé pedig, ha időben végigjárjuk a túrát,' +
        ' egy finom levesre is jut még időnk ugyanitt.',
        picUrl: '../assets/hotalpas.jpg',
        category: 'Hótalpas túra',
        creatorId: 3
      },
      {
        id: 4,
        title: 'Mont Blanc csúcsmászás',
        days: 5,
        country: 'Franciaország',
        region: 'Mont Blanc csoport',
        date: '2018-08-15',
        description: 'Ehhez nagyon nincs is mit hozzátenni. Telekocsi' +
        ' rendszerben szervezzük a túrát, melyet a normál út felől' +
        ' tervezünk. Szállás a Gouter-házban, ezért kérlek, időben' +
        ' jelentkezz, mert abba a házba elég hamar fogynak a helyek!' +
        ' Magashegyi túra, ennek megfelelő felszerelés kell, ezt neked kell' +
        ' beszerezni. A túravezetésért díjat nem számolunk fel, a túra tehát' +
        ' önköltséges, viszont az autókra nemcsak benzin, hanem amortizációs' +
        ' költséget is számolunk!',
        picUrl: '../assets/montblanc.jpg',
        category: 'Magashegyi túra',
        creatorId: 4
      },
      {
        id: 5,
        title: 'Via Ferrata túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-05-15',
        description: 'Kora reggeli indulással tervezzük a Haid Steigen való' +
        ' felmászást a Preinerwand tetejére. Ez a ferrata D jelzésű, de' +
        ' kezdők is bevállalhatják. Ferrata felszerelés kell, egy jó' +
        ' túracipő, és egy védőkesztyű sem árt. Ez a ferrata állandóan' +
        ' zsúfolt, ezért csak türelmes emberek jelentkezését várjuk.',
        picUrl: 'assets/haidsteig.jpg',
        category: 'Via Ferrata túra',
        creatorId: 1,
        guestsIds: [2, 3]
      },
      {
        id: 6,
        title: 'Hótalpas túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-01-15',
        description: 'Hótalpas túrára invitállak benneteket. Korán reggel' +
        ' Budapestről indulunk, majd a Schneeberg lábához érünk. Itt' +
        ' felcsatoljuk hótalpainkat, és feltúrázunk a Schneeberg tetejére.' +
        ' Útközben a sípálya tetején lévő hüttében feltankolunk' +
        ' forraltborból, visszafelé pedig, ha időben végigjárjuk a túrát,' +
        ' egy finom levesre is jut még időnk ugyanitt.',
        picUrl: 'assets/hotalpas.jpg',
        category: 'Hótalpas túra',
        creatorId: 4
      },
      {
        id: 7,
        title: 'Mont Blanc csúcsmászás',
        days: 5,
        country: 'Franciaország',
        region: 'Mont Blanc csoport',
        date: '2018-08-15',
        description: 'Ehhez nagyon nincs is mit hozzátenni. Telekocsi' +
        ' rendszerben szervezzük a túrát, melyet a normál út felől' +
        ' tervezünk. Szállás a Gouter-házban, ezért kérlek, időben' +
        ' jelentkezz, mert abba a házba elég hamar fogynak a helyek!' +
        ' Magashegyi túra, ennek megfelelő felszerelés kell, ezt neked kell' +
        ' beszerezni. A túravezetésért díjat nem számolunk fel, a túra tehát' +
        ' önköltséges, viszont az autókra nemcsak benzin, hanem amortizációs' +
        ' költséget is számolunk!',
        picUrl: 'assets/montblanc.jpg',
        category: 'Magashegyi túra',
        creatorId: 2,
        guestsIds: [1, 3, 4]
      },
      {
        id: 8,
        title: 'Via Ferrata túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-05-15',
        description: 'Kora reggeli indulással tervezzük a Haid Steigen való' +
        ' felmászást a Preinerwand tetejére. Ez a ferrata D jelzésű, de' +
        ' kezdők is bevállalhatják. Ferrata felszerelés kell, egy jó' +
        ' túracipő, és egy védőkesztyű sem árt. Ez a ferrata állandóan' +
        ' zsúfolt, ezért csak türelmes emberek jelentkezését várjuk.',
        picUrl: 'assets/haidsteig.jpg',
        category: 'Via Ferrata túra',
        creatorId: 1,
        guestsIds: [2, 3]
      },
      {
        id: 9,
        title: 'Hótalpas túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-01-15',
        description: 'Hótalpas túrára invitállak benneteket. Korán reggel' +
        ' Budapestről indulunk, majd a Schneeberg lábához érünk. Itt' +
        ' felcsatoljuk hótalpainkat, és feltúrázunk a Schneeberg tetejére.' +
        ' Útközben a sípálya tetején lévő hüttében feltankolunk' +
        ' forraltborból, visszafelé pedig, ha időben végigjárjuk a túrát,' +
        ' egy finom levesre is jut még időnk ugyanitt.',
        picUrl: 'assets/hotalpas.jpg',
        category: 'Hótalpas túra',
        creatorId: 3
      },
      {
        id: 10,
        title: 'Mont Blanc csúcsmászás',
        days: 5,
        country: 'Franciaország',
        region: 'Mont Blanc csoport',
        date: '2018-08-15',
        description: 'Ehhez nagyon nincs is mit hozzátenni. Telekocsi' +
        ' rendszerben szervezzük a túrát, melyet a normál út felől' +
        ' tervezünk. Szállás a Gouter-házban, ezért kérlek, időben' +
        ' jelentkezz, mert abba a házba elég hamar fogynak a helyek!' +
        ' Magashegyi túra, ennek megfelelő felszerelés kell, ezt neked kell' +
        ' beszerezni. A túravezetésért díjat nem számolunk fel, a túra tehát' +
        ' önköltséges, viszont az autókra nemcsak benzin, hanem amortizációs' +
        ' költséget is számolunk!',
        picUrl: 'assets/montblanc.jpg',
        category: 'Magashegyi túra',
        creatorId: 4
      },
      {
        id: 11,
        title: 'Via Ferrata túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-05-15',
        description: 'Kora reggeli indulással tervezzük a Haid Steigen való' +
        ' felmászást a Preinerwand tetejére. Ez a ferrata D jelzésű, de' +
        ' kezdők is bevállalhatják. Ferrata felszerelés kell, egy jó' +
        ' túracipő, és egy védőkesztyű sem árt. Ez a ferrata állandóan' +
        ' zsúfolt, ezért csak türelmes emberek jelentkezését várjuk.',
        picUrl: 'assets/haidsteig.jpg',
        category: 'Via Ferrata túra',
        creatorId: 1,
        guestsIds: [2, 3]
      },
      {
        id: 12,
        title: 'Hótalpas túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-01-15',
        description: 'Hótalpas túrára invitállak benneteket. Korán reggel' +
        ' Budapestről indulunk, majd a Schneeberg lábához érünk. Itt' +
        ' felcsatoljuk hótalpainkat, és feltúrázunk a Schneeberg tetejére.' +
        ' Útközben a sípálya tetején lévő hüttében feltankolunk' +
        ' forraltborból, visszafelé pedig, ha időben végigjárjuk a túrát,' +
        ' egy finom levesre is jut még időnk ugyanitt.',
        picUrl: 'assets/hotalpas.jpg',
        category: 'Hótalpas túra',
        creatorId: 4
      },
      {
        id: 13,
        title: 'Mont Blanc csúcsmászás',
        days: 5,
        country: 'Franciaország',
        region: 'Mont Blanc csoport',
        date: '2018-08-15',
        description: 'Ehhez nagyon nincs is mit hozzátenni. Telekocsi' +
        ' rendszerben szervezzük a túrát, melyet a normál út felől' +
        ' tervezünk. Szállás a Gouter-házban, ezért kérlek, időben' +
        ' jelentkezz, mert abba a házba elég hamar fogynak a helyek!' +
        ' Magashegyi túra, ennek megfelelő felszerelés kell, ezt neked kell' +
        ' beszerezni. A túravezetésért díjat nem számolunk fel, a túra tehát' +
        ' önköltséges, viszont az autókra nemcsak benzin, hanem amortizációs' +
        ' költséget is számolunk!',
        picUrl: 'assets/montblanc.jpg',
        category: 'Magashegyi túra',
        creatorId: 2,
        guestsIds: [1, 3, 4]
      },
      {
        id: 14,
        title: 'Via Ferrata túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-05-15',
        description: 'Kora reggeli indulással tervezzük a Haid Steigen való' +
        ' felmászást a Preinerwand tetejére. Ez a ferrata D jelzésű, de' +
        ' kezdők is bevállalhatják. Ferrata felszerelés kell, egy jó' +
        ' túracipő, és egy védőkesztyű sem árt. Ez a ferrata állandóan' +
        ' zsúfolt, ezért csak türelmes emberek jelentkezését várjuk.',
        picUrl: 'assets/haidsteig.jpg',
        category: 'Via Ferrata túra',
        creatorId: 1,
        guestsIds: [2, 3]
      },
      {
        id: 15,
        title: 'Hótalpas túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-01-15',
        description: 'Hótalpas túrára invitállak benneteket. Korán reggel' +
        ' Budapestről indulunk, majd a Schneeberg lábához érünk. Itt' +
        ' felcsatoljuk hótalpainkat, és feltúrázunk a Schneeberg tetejére.' +
        ' Útközben a sípálya tetején lévő hüttében feltankolunk' +
        ' forraltborból, visszafelé pedig, ha időben végigjárjuk a túrát,' +
        ' egy finom levesre is jut még időnk ugyanitt.',
        picUrl: 'assets/hotalpas.jpg',
        category: 'Hótalpas túra',
        creatorId: 3
      },
      {
        id: 16,
        title: 'Mont Blanc csúcsmászás',
        days: 5,
        country: 'Franciaország',
        region: 'Mont Blanc csoport',
        date: '2018-08-15',
        description: 'Ehhez nagyon nincs is mit hozzátenni. Telekocsi' +
        ' rendszerben szervezzük a túrát, melyet a normál út felől' +
        ' tervezünk. Szállás a Gouter-házban, ezért kérlek, időben' +
        ' jelentkezz, mert abba a házba elég hamar fogynak a helyek!' +
        ' Magashegyi túra, ennek megfelelő felszerelés kell, ezt neked kell' +
        ' beszerezni. A túravezetésért díjat nem számolunk fel, a túra tehát' +
        ' önköltséges, viszont az autókra nemcsak benzin, hanem amortizációs' +
        ' költséget is számolunk!',
        picUrl: 'assets/montblanc.jpg',
        category: 'Magashegyi túra',
        creatorId: 4
      },
      {
        id: 17,
        title: 'Via Ferrata túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-05-15',
        description: 'Kora reggeli indulással tervezzük a Haid Steigen való' +
        ' felmászást a Preinerwand tetejére. Ez a ferrata D jelzésű, de' +
        ' kezdők is bevállalhatják. Ferrata felszerelés kell, egy jó' +
        ' túracipő, és egy védőkesztyű sem árt. Ez a ferrata állandóan' +
        ' zsúfolt, ezért csak türelmes emberek jelentkezését várjuk.',
        picUrl: 'assets/haidsteig.jpg',
        category: 'Via Ferrata túra',
        creatorId: 1,
        guestsIds: [2, 3]
      },
      {
        id: 18,
        title: 'Hótalpas túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-01-15',
        description: 'Hótalpas túrára invitállak benneteket. Korán reggel' +
        ' Budapestről indulunk, majd a Schneeberg lábához érünk. Itt' +
        ' felcsatoljuk hótalpainkat, és feltúrázunk a Schneeberg tetejére.' +
        ' Útközben a sípálya tetején lévő hüttében feltankolunk' +
        ' forraltborból, visszafelé pedig, ha időben végigjárjuk a túrát,' +
        ' egy finom levesre is jut még időnk ugyanitt.',
        picUrl: 'assets/hotalpas.jpg',
        category: 'Hótalpas túra',
        creatorId: 4
      },
      {
        id: 19,
        title: 'Mont Blanc csúcsmászás',
        days: 5,
        country: 'Franciaország',
        region: 'Mont Blanc csoport',
        date: '2018-08-15',
        description: 'Ehhez nagyon nincs is mit hozzátenni. Telekocsi' +
        ' rendszerben szervezzük a túrát, melyet a normál út felől' +
        ' tervezünk. Szállás a Gouter-házban, ezért kérlek, időben' +
        ' jelentkezz, mert abba a házba elég hamar fogynak a helyek!' +
        ' Magashegyi túra, ennek megfelelő felszerelés kell, ezt neked kell' +
        ' beszerezni. A túravezetésért díjat nem számolunk fel, a túra tehát' +
        ' önköltséges, viszont az autókra nemcsak benzin, hanem amortizációs' +
        ' költséget is számolunk!',
        picUrl: 'assets/montblanc.jpg',
        category: 'Magashegyi túra',
        creatorId: 2,
        guestsIds: [1, 3, 4]
      },
      {
        id: 20,
        title: 'Via Ferrata túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-05-15',
        description: 'Kora reggeli indulással tervezzük a Haid Steigen való' +
        ' felmászást a Preinerwand tetejére. Ez a ferrata D jelzésű, de' +
        ' kezdők is bevállalhatják. Ferrata felszerelés kell, egy jó' +
        ' túracipő, és egy védőkesztyű sem árt. Ez a ferrata állandóan' +
        ' zsúfolt, ezért csak türelmes emberek jelentkezését várjuk.',
        picUrl: 'assets/haidsteig.jpg',
        category: 'Via Ferrata túra',
        creatorId: 1,
        guestsIds: [2, 3]
      },
      {
        id: 21,
        title: 'Hótalpas túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-01-15',
        description: 'Hótalpas túrára invitállak benneteket. Korán reggel' +
        ' Budapestről indulunk, majd a Schneeberg lábához érünk. Itt' +
        ' felcsatoljuk hótalpainkat, és feltúrázunk a Schneeberg tetejére.' +
        ' Útközben a sípálya tetején lévő hüttében feltankolunk' +
        ' forraltborból, visszafelé pedig, ha időben végigjárjuk a túrát,' +
        ' egy finom levesre is jut még időnk ugyanitt.',
        picUrl: 'assets/hotalpas.jpg',
        category: 'Hótalpas túra',
        creatorId: 3
      },
      {
        id: 22,
        title: 'Mont Blanc csúcsmászás',
        days: 5,
        country: 'Franciaország',
        region: 'Mont Blanc csoport',
        date: '2018-08-15',
        description: 'Ehhez nagyon nincs is mit hozzátenni. Telekocsi' +
        ' rendszerben szervezzük a túrát, melyet a normál út felől' +
        ' tervezünk. Szállás a Gouter-házban, ezért kérlek, időben' +
        ' jelentkezz, mert abba a házba elég hamar fogynak a helyek!' +
        ' Magashegyi túra, ennek megfelelő felszerelés kell, ezt neked kell' +
        ' beszerezni. A túravezetésért díjat nem számolunk fel, a túra tehát' +
        ' önköltséges, viszont az autókra nemcsak benzin, hanem amortizációs' +
        ' költséget is számolunk!',
        picUrl: 'assets/montblanc.jpg',
        category: 'Magashegyi túra',
        creatorId: 4
      },
      {
        id: 23,
        title: 'Via Ferrata túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-05-15',
        description: 'Kora reggeli indulással tervezzük a Haid Steigen való' +
        ' felmászást a Preinerwand tetejére. Ez a ferrata D jelzésű, de' +
        ' kezdők is bevállalhatják. Ferrata felszerelés kell, egy jó' +
        ' túracipő, és egy védőkesztyű sem árt. Ez a ferrata állandóan' +
        ' zsúfolt, ezért csak türelmes emberek jelentkezését várjuk.',
        picUrl: 'assets/haidsteig.jpg',
        category: 'Via Ferrata túra',
        creatorId: 1,
        guestsIds: [2, 3]
      },
      {
        id: 24,
        title: 'Hótalpas túra',
        days: 1,
        country: 'Ausztria',
        region: 'Rax',
        date: '2018-01-15',
        description: 'Hótalpas túrára invitállak benneteket. Korán reggel' +
        ' Budapestről indulunk, majd a Schneeberg lábához érünk. Itt' +
        ' felcsatoljuk hótalpainkat, és feltúrázunk a Schneeberg tetejére.' +
        ' Útközben a sípálya tetején lévő hüttében feltankolunk' +
        ' forraltborból, visszafelé pedig, ha időben végigjárjuk a túrát,' +
        ' egy finom levesre is jut még időnk ugyanitt.',
        picUrl: 'assets/hotalpas.jpg',
        category: 'Hótalpas túra',
        creatorId: 4
      }
    ];
  }

  getAllEvents() {
    return this._events.map(ev => {
      return {
        ...ev,
        creator: this._userService.getUserById(ev.creatorId),
        guests: ev.guestsIds ? ev.guestsIds.map(guest => {
          return this._userService.getUserById(guest);
        }) : []
      };
    });
  }

  getEventById(id: number) {
    const event = this._events.filter(ev => ev.id === id);
    return event.length > 0 ? event[0] : new EventModel(EventModel.emptyEvent);
  }

  update(ev: EventModel) {
    this._events = this._events.map(event => event.id === ev.id ? {...ev} : event);
  }

  create(ev: EventModel) {
    this._events = [
      ...this._events,
      {
        id: this._getMaxId() + 1,
        ...ev
      }
    ];
  }

  private _getMaxId() {
    return this._events.reduce((x, y) => x.id > y.id ? x : y).id;
  }
}
