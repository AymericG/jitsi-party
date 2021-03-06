import {
  defaultInformation, defaultPhysics,
  Information, ParticipantBase as IParticipantBase, Physics, Tracks,
} from '@models/Participant'
import {MapObject} from '@stores/MapObject'
import {JitsiTrack} from 'lib-jitsi-meet'
import {action, computed, observable} from 'mobx'
import {getRandomColor, getRandomColorRGB, shallowObservable, Store} from '../utils'
import {Plugins} from './plugins'

export class ParticipantBase extends MapObject implements Store<IParticipantBase> {
  readonly id: string
  information = shallowObservable<Information>(defaultInformation)
  plugins: Plugins
  tracks = shallowObservable<TracksStore<JitsiTrack>>(new TracksStore<JitsiTrack>())
  physics = shallowObservable<Physics>(defaultPhysics)
  @observable.ref mousePosition: [number, number] | undefined = undefined

  getColor() {
    return getRandomColor(this.information.name)
  }
  getColorRGB() {
    return getRandomColorRGB(this.information.name)
  }

  constructor(id: string) {
    super()
    this.id = id
    this.plugins = new Plugins(this)
  }

  saveInformationToStorage(isLocalStorage:boolean) {
    let storage = sessionStorage
    if (isLocalStorage) { storage = localStorage }
    //  console.log(storage === localStorage ? 'Save to localStorage' : 'Save to sessionStorage')
    storage.setItem('localParticipantInformation', JSON.stringify(this.information))
  }

  @action.bound
  loadInformationFromStorage() {
    let storage = localStorage
    if (sessionStorage.getItem('localParticipantInformation')) {
      storage = sessionStorage
    }
    console.log(storage === localStorage ? 'Load from localStorage' : 'Load from sessionStorage')
    const infoInStr = storage.getItem('localParticipantInformation')
    if (infoInStr) {
      Object.assign(this.information, JSON.parse(infoInStr))
    }
  }
  @action.bound
  setInformation(info: Information) {
    Object.assign(this.information, info)
    //  console.log('setInformation called')
  }
  @action.bound
  setPhysics(physics: Partial<Physics>) {
    Object.assign(this.physics, physics)
  }
}

export class TracksStore<T extends JitsiTrack> implements Tracks<T>{
  @observable.ref audio:T|undefined = undefined
  @observable.ref avatar:T|undefined = undefined
  @observable.ref screen:T[][] = []
  @computed get audioStream() { return this.audio?.getOriginalStream() }
  @computed get avatarStream() { return this.avatar?.getOriginalStream() }
  @computed get screenStream() { return this.screen.map(tracks => tracks[0].getOriginalStream()) }
}
