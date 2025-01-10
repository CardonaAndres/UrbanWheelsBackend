import { connDB } from './dataBase.js'

const db = await connDB();

export const getStates = async () => {

    const [ states ] = await db.query('SELECT * FROM states');
    return states;

}

export const getStateById = async (state_ID) => {

    const [ state ] = await db.query('SELECT * FROM states WHERE state_ID = ? ', [state_ID]);
    return state;

}