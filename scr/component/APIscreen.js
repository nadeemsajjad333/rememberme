
const baseUrl = 'https://remembermefamilytree.com/api/'
const baseUrl2 = 'https://remembermefamilytree.com/api/family-tree-json/'

const RegisterApi = async (payload,data) => {
    try {
      const request = baseUrl + `${payload.url}`;
      const response = await fetch(request, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });
  
      const json = await response.json();
  
      return json;
    } catch (error) {
      console.error(error);
    }
  };

const AllPostApi = async(payload)=>{
  console.log("payload",payload);
  try{
    const request = baseUrl + `${payload.url}`
    const response =await fetch(request,{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type' :'application/json',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:JSON.stringify(payload)

    })
    const json = await response.json()
    return json

  }catch(error){
    console.error(error)
  }
}

const FileUploaded = async (payload,data) => {
  // console.log('payload upload api',payload)
  // console.log('data upload api',data)
  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${payload.Auth}`,

      },
      body: data,
    });

    const json = await response.json();

    return json;
  } catch (error) {
    console.error(error);
  }
};

const  AllGetAPI= async (payload,data) => {

  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:data,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const  AllGetAPI2= async (payload,data) => {

  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:data,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const  GetUserList= async (payload,data) => {

  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:data,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const AddEventAPI = async(payload,data)=>{

  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:data,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const fcm_Update = async (payload,data) => {
   
  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:JSON.stringify(payload)
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const audioConvert = async (payload,data) => {
  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    });

    const json = await response.json();

    return json;
  } catch (error) {
    console.error(error);
  }
};
const referCodeAPI = async (payload,data) => {
  
  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:JSON.stringify(payload)
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const UpdateProfile = async (payload, data) => {
  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body: data,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const  treeUsrAPI= async (payload,data) => {

  try {
    const request = baseUrl2 + `${payload.url}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:data,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const ForgotPassword = async (payload, data) => {
  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body: data,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const  UserMediaAPi= async (payload,data) => {

  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:data,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
const  stripecheckapi= async (payload,data) => {

  try {
    const request = baseUrl + `${payload.url}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.Auth}`,
      },
      body:data,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
export{
    RegisterApi,
    AllPostApi,
    FileUploaded,
    AllGetAPI,
    GetUserList,
    AddEventAPI,
    fcm_Update,
    AllGetAPI2,
    audioConvert,
    referCodeAPI,
    UpdateProfile,
    treeUsrAPI,
    ForgotPassword,
    UserMediaAPi,
    stripecheckapi
}