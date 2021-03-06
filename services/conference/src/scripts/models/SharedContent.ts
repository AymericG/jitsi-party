import {MapObject} from './MapObject'

export interface SharedContent extends MapObject {
  id: string    //  unique ID (generated by participant id + number)
  zorder: number  //  unix timestamp when shared or moved to top.
  type: string  //  object type ('img', etc)
  url: string   //  url or text to share
  size: [number, number]
  pinned: boolean
}

export interface ParticipantContents{
  participantId: string
  myContents: Map<string, SharedContent>
  updateRequest: Map<string, SharedContent>
  removeRequest: Set<string>
}
