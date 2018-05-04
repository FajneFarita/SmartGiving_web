import axios from "axios";
import requests from '../data/requests'

export const FakeData = false;

export const GetAllOpenGifts = completion => {
  if (completion === undefined) {
    console.warn("Completion block for GetAllOpenGifts is undefined :(");
  }

  if (FakeData) {
    completion(requests.recipients, undefined)
    return
  }

  axios
    .get(`/api/activeRecipientsList`)
    .then(res => {
      completion(res.data, undefined);
    })
    .catch(err => {
      completion(undefined, err);
    });
};


export const UpdateDatabase = completion => {
  axios
    .get(`/api/updateDB`)
    .then(res => {
      completion()
    })
    .catch(err => {
      completion(err)
    })
}


export const CreateNewGift = (gift, completion) => {
  axios
    .put(`/api/addGift`, gift)
    .then(res => {
      completion();
    })
    .catch(err => {
      completion(err);
    });
};

export const GetAllMerchants = completion => {
  axios
    .get(`/api/getMerchants`)
    .then(res => {
      completion(res.data, undefined);
    })
    .catch(err => {
      completion(undefined, err);
    });
};

export const CreateNewRecipient = (recipient, completion) => {
  axios
    .put(`/api/addRecipient`, recipient)
    .then(res => {
      completion();
    })
    .catch(err => {
      completion(err);
    });
};

export const CreateNewDonor = (donor, completion) => {
  axios
    .put(`/api/addDonor`, donor)
    .then(res => {
      completion();
    })
    .catch(err => {
      completion(err);
    });
};

export const CreateNewMerchant = (merchant, completion) => {
  axios
    .put(`/api/addMerchant`, merchant)
    .then(res => {
      completion();
    })
    .catch(err => {
      completion(err);
    });
};
