import * as statesModel from '../models/states.model.js'

export const getStates = async (req, res) => {

    try {

        const states = await statesModel.getStates();
        return res.status(200).json(states)

    } catch (err) {
        res.status(500).json({ message : err.message });
    }

}

export const getStateById = async (req, res) => {

    
    try {

        const state_ID = req.params.id;
        const getState = await statesModel.getStateById(state_ID);
        return res.status(200).json( getState )

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }

}

export const createState = async (req, res) => {

}

export const updatedState = (req, res) => {
    
}

export const deleteState = (req, res) => {

}