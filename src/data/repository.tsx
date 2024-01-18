import { initializeApp } from "firebase/app";
import { DocumentData, QuerySnapshot, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore"
import { DataSnapshot, getDatabase, onValue, ref, query as realtimeQuery, orderByChild, equalTo, update, onChildAdded } from 'firebase/database'

export interface EmCallStruct {
  em_call_id: string,
  em_call_status_id: string,
  em_transport_id: string,
  em_pvd_id: string,
  created_at: number,
  user_phone_number: string,
  user_lat:string,
  user_long:string,
  uid: string
}

export interface EmProviderStruct {
  em_pvd_id: string,
  name: string,
  em_type: string
}

export interface EmTypeStruct {
  em_type_id: string,
  word: string
}

export interface EmCallStatus {
  em_call_status_id: string,
  word: string
}

export interface EmTransportStruct {
  em_transport_id: string,
  em_pvd_id: string,
  is_available: boolean,
  regist_number: string,
  name: string
}

export interface UserStruct {
  uid: string,
  name: string,
  phone_number: string,
  nik: string
}

export class Repository {
  firebaseConfig = {
    apiKey: process.env.FB_APIKEY,
    authDomain: process.env.FB_AUTHDOMAIN,
    databaseURL: process.env.FB_DATABASEURL,
    projectId: process.env.FB_PROJECTID,
    storageBucket: process.env.FB_STORAGEBUCKET,
    messagingSenderId: process.env.FB_MESSAGINGSENDERID,
    appId: process.env.FB_APPID
  };
  fbApp = initializeApp(this.firebaseConfig);
  firestore = getFirestore(this.fbApp)
  realtimeDb = getDatabase(this.fbApp)

  async getAllEmProvider(
    onSuccess: (data: QuerySnapshot<DocumentData, DocumentData>) => void,
    onError: (e: Error) => void
  ) {
    await getDocs(
      query(
        collection(
          this.firestore,
          "em_srv_provider"
        )
      )
    ).then(value => {
      onSuccess(value)
    }).catch((e: Error) => {
      onError(e)
    })
  }

  listenEmergencyCall(
    emPvdId: string,
    onListened: (data: DataSnapshot) => void,
    onNewChildAdded: (data: DataSnapshot) => void
  ) {
    const q = realtimeQuery(
      ref(
        this.realtimeDb,
        "em_call"
      ),
      orderByChild("em_pvd_id"),
      equalTo(emPvdId)
    )

    onValue(
      q,
      (snapshot) => {
        onListened(snapshot)
      }
    )

    onChildAdded(
      q,
      (snapshot, _) => {
        // console.log(snapshot.exportVal())
        onNewChildAdded(snapshot)
      }
    )
  }

  async getEmProviderById(
    id: string,
    onSuccess: (data: EmProviderStruct) => void
  ) {
    await getDoc(
      doc(
        this.firestore,
        "em_srv_provider",
        id
      )
    ).then(s => {
      onSuccess(
        {
          em_pvd_id: s.get("em_pvd_id"),
          name: s.get("name"),
          em_type: s.get("em_type")
        }
      )
    }).catch(e => {
      console.log(e)
    })
  }

  async getEmType(
    emType: string,
    onSuccess: (data: EmTypeStruct) => void
  ) {
    await getDoc(
      doc(
        this.firestore,
        "em_type",
        emType
      )
    ).then(s => {
      console.log(s.get("em_type_id"))
      onSuccess(
        {
          em_type_id: s.get("em_type_id"),
          word: s.get("word")
        }
      )
    }).catch(e => {
      console.log(e)
    })
  }

  async getAllCallStatus(
    onSuccess: (datas: EmCallStatus[]) => void
  ) {
    getDocs(
      collection(
        this.firestore,
        "em_call_status"
      )
    ).then(s => {
      onSuccess(
        s.docs.map((item) => {
          return {
            em_call_status_id: item.get("em_call_status_id"),
            word: item.get("word")
          }
        })
      )
    }).catch(e => {
      console.log(e)
    })
  }

  changeCallStatus(
    emCallId: string,
    newStatus: string,
    onSuccess: () => void
  ) {
    update(
      ref(this.realtimeDb, `/em_call/${emCallId}`),
      {
        "em_call_status_id": newStatus
      }
    ).then(() => {
      onSuccess()
    }).catch(e => {
      console.log(e)
    })
  }

  changeCallEmTransportId(
    emCallId: string,
    emTransportId: string,
    onSuccess: () => void
  ) {
    update(
      ref(this.realtimeDb, `/em_call/${emCallId}`),
      {
        "em_transport_id": emTransportId
      }
    ).then(() => {
      onSuccess()
    }).catch(e => {
      console.log(e)
    })
  }

  changeEmTransportAvailability(
    emTransportId: string,
    status: boolean,
    onSuccess: () => void
  ) {
    updateDoc(
      doc(
        this.firestore,
        "em_transport",
        emTransportId
      ),
      {
        "is_available": status
      }
    ).then(() => {
      onSuccess()
    }).catch(e => {
      console.log(e)
    })
  }

  getEmTrasportById(
    emPvdId: string,
    onSuccess: (data: EmTransportStruct[]) => void
  ) {
    getDocs(
      query(
        collection(this.firestore, "em_transport"),
        where("em_pvd_id", "==", emPvdId),
      )
    ).then(s => {
      onSuccess(
        s.docs.map(item => {
          return {
            em_pvd_id: item.get("em_pvd_id"),
            em_transport_id: item.get("em_transport_id"),
            is_available: item.get("is_available"),
            regist_number: item.get("regist_number"),
            name: item.get("name")
          }
        })
      )
    }).catch(e => {
      console.log(e)
    })
  }

  getSingleEmTransport(
    emTransportId: string,
    onSuccess: (data: EmTransportStruct) => void
  ) {
    getDoc(
      doc(
        this.firestore,
        "em_transport",
        emTransportId
      )
    ).then(item => {
      onSuccess(
        {
          em_pvd_id: item.get("em_pvd_id"),
          em_transport_id: item.get("em_transport_id"),
          is_available: item.get("is_available"),
          regist_number: item.get("regist_number"),
          name: item.get("name")
        }
      )
    }).catch(e => {
      console.log(e)
    })
  }

  getSingleUser(
    uid: string,
    onSuccess: (data: UserStruct) => void
  ) {
    getDoc(
      doc(
        this.firestore,
        "user",
        uid
      )
    ).then(s => {
      onSuccess({
        uid: s.get("uid"),
        name: s.get("name"),
        nik: s.get("nik"),
        phone_number: s.get("phone_number")
      })
    }).catch(e => {
      console.log(e)
    })
  }

  sendNotificationToDriver(
    id: string,
    emCallId: string,
    title: string,
    body: string,
    onSuccess: () => void
  ) {
    getDoc(
      doc(
        this.firestore,
        "fcm_token",
        id
      )
    ).then(fcm => {
      fetch("https://fcm.googleapis.com/fcm/send", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "key=" + process.env.FB_FCM_SERVERKEY
        },
        body: JSON.stringify(
          {
            "to": fcm.get("token"),
            "notification": {
              "title": title,
              "body": body,
              "mutable_content": true,
              "sound": "Tri-tone"
            },

            "data": {
              "em_call_id": emCallId
            }
          }
        ),
        method: "POST"
      }).then(s => {
        if (s.status == 200) {
          onSuccess()
        }
      }).catch(e => {
        console.log(e)
      })
    }).catch(e => {
      console.log(e)
    })
  }

  sendNotificationToUser(
    uid: string,
    title: string,
    body: string,
    onSuccess: () => void
  ) {
    getDoc(
      doc(
        this.firestore,
        "fcm_token",
        uid
      )
    ).then(fcm => {
      fetch("https://fcm.googleapis.com/fcm/send", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "key=" + process.env.FB_FCM_SERVERKEY
        },
        body: JSON.stringify(
          {
            "to": fcm.get("token"),
            "notification": {
              "title": title,
              "body": body,
              "mutable_content": true,
              "sound": "Tri-tone"
            },

            "data": {

            }
          }
        ),
        method: "POST"
      }).then(s => {
        if (s.status == 200) {
          onSuccess()
        }
      }).catch(e => {
        console.log(e)
      })
    }).catch(e => {
      console.log(e)
    })
  }
}