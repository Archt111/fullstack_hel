import axios from "axios";
const URL = 'http://localhost:3001/persons';

const load = () => {
  return axios.get(URL).then(response => response.data)
}

const create = newPerson => {
  const request = axios.post(URL, newPerson)
  return request.then(response => response.data)}

const deleteP = id => {
  const request = axios.delete(`${URL}/${id}`)
  return request.then(response => response.data)}

const updatePhone = (id, changedP) => {
  const request = axios.put(`${URL}/${id}`, changedP)
  return request.then(response => response.data)}

export default {load,create, deleteP, updatePhone}