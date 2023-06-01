import {
  $CombinedState,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store/store';
import { ImageDTO } from 'services/api';

export const CONTROLNET_MODELS = [
  'lllyasviel/sd-controlnet-canny',
  'lllyasviel/sd-controlnet-depth',
  'lllyasviel/sd-controlnet-hed',
  'lllyasviel/sd-controlnet-seg',
  'lllyasviel/sd-controlnet-openpose',
  'lllyasviel/sd-controlnet-scribble',
  'lllyasviel/sd-controlnet-normal',
  'lllyasviel/sd-controlnet-mlsd',
];

export const CONTROLNET_PROCESSORS = [
  'canny',
  'contentShuffle',
  'hed',
  'lineart',
  'lineartAnime',
  'mediapipeFace',
  'midasDepth',
  'mlsd',
  'normalBae',
  'openpose',
  'pidi',
  'zoeDepth',
];

export type ControlNetProcessor = (typeof CONTROLNET_PROCESSORS)[number];

export type ControlNetModel = (typeof CONTROLNET_MODELS)[number];

export const initialControlNet: Omit<ControlNet, 'controlNetId'> = {
  isEnabled: true,
  model: CONTROLNET_MODELS[0],
  weight: 1,
  beginStepPct: 0,
  endStepPct: 1,
  controlImage: null,
  isControlImageProcessed: false,
  processedControlImage: null,
  processor: 'canny',
};

export type ControlNet = {
  controlNetId: string;
  isEnabled: boolean;
  model: ControlNetModel;
  weight: number;
  beginStepPct: number;
  endStepPct: number;
  controlImage: ImageDTO | null;
  isControlImageProcessed: boolean;
  processedControlImage: ImageDTO | null;
  processor: ControlNetProcessor;
};

export type ControlNetState = {
  controlNets: Record<string, ControlNet>;
  isEnabled: boolean;
};

export const initialControlNetState: ControlNetState = {
  controlNets: {},
  isEnabled: false,
};

export const controlNetSlice = createSlice({
  name: 'controlNet',
  initialState: initialControlNetState,
  reducers: {
    isControlNetEnabledToggled: (state) => {
      state.isEnabled = !state.isEnabled;
    },
    controlNetAdded: (
      state,
      action: PayloadAction<{ controlNetId: string }>
    ) => {
      const { controlNetId } = action.payload;
      state.controlNets[controlNetId] = {
        ...initialControlNet,
        controlNetId,
      };
    },
    controlNetAddedFromImage: (
      state,
      action: PayloadAction<{ controlNetId: string; controlImage: ImageDTO }>
    ) => {
      const { controlNetId, controlImage } = action.payload;
      state.controlNets[controlNetId] = {
        ...initialControlNet,
        controlNetId,
        controlImage,
      };
    },
    controlNetRemoved: (state, action: PayloadAction<string>) => {
      const controlNetId = action.payload;
      delete state.controlNets[controlNetId];
    },
    controlNetToggled: (state, action: PayloadAction<string>) => {
      const controlNetId = action.payload;
      state.controlNets[controlNetId].isEnabled =
        !state.controlNets[controlNetId].isEnabled;
    },
    controlNetImageChanged: (
      state,
      action: PayloadAction<{
        controlNetId: string;
        controlImage: ImageDTO | null;
      }>
    ) => {
      const { controlNetId, controlImage } = action.payload;
      state.controlNets[controlNetId].controlImage = controlImage;
      state.controlNets[controlNetId].processedControlImage = null;
    },
    isControlNetImageProcessedToggled: (
      state,
      action: PayloadAction<{
        controlNetId: string;
      }>
    ) => {
      const { controlNetId } = action.payload;
      state.controlNets[controlNetId].isControlImageProcessed =
        !state.controlNets[controlNetId].isControlImageProcessed;
    },
    controlNetProcessedImageChanged: (
      state,
      action: PayloadAction<{
        controlNetId: string;
        processedControlImage: ImageDTO | null;
      }>
    ) => {
      const { controlNetId, processedControlImage } = action.payload;
      state.controlNets[controlNetId].processedControlImage =
        processedControlImage;
    },
    controlNetModelChanged: (
      state,
      action: PayloadAction<{ controlNetId: string; model: ControlNetModel }>
    ) => {
      const { controlNetId, model } = action.payload;
      state.controlNets[controlNetId].model = model;
    },
    controlNetWeightChanged: (
      state,
      action: PayloadAction<{ controlNetId: string; weight: number }>
    ) => {
      const { controlNetId, weight } = action.payload;
      state.controlNets[controlNetId].weight = weight;
    },
    controlNetBeginStepPctChanged: (
      state,
      action: PayloadAction<{ controlNetId: string; beginStepPct: number }>
    ) => {
      const { controlNetId, beginStepPct } = action.payload;
      state.controlNets[controlNetId].beginStepPct = beginStepPct;
    },
    controlNetEndStepPctChanged: (
      state,
      action: PayloadAction<{ controlNetId: string; endStepPct: number }>
    ) => {
      const { controlNetId, endStepPct } = action.payload;
      state.controlNets[controlNetId].endStepPct = endStepPct;
    },
    controlNetProcessorChanged: (
      state,
      action: PayloadAction<{
        controlNetId: string;
        processor: ControlNetProcessor;
      }>
    ) => {
      const { controlNetId, processor } = action.payload;
      state.controlNets[controlNetId].processor = processor;
    },
  },
});

export const {
  isControlNetEnabledToggled,
  controlNetAdded,
  controlNetAddedFromImage,
  controlNetRemoved,
  controlNetImageChanged,
  isControlNetImageProcessedToggled,
  controlNetProcessedImageChanged,
  controlNetToggled,
  controlNetModelChanged,
  controlNetWeightChanged,
  controlNetBeginStepPctChanged,
  controlNetEndStepPctChanged,
  controlNetProcessorChanged,
} = controlNetSlice.actions;

export default controlNetSlice.reducer;

export const controlNetSelector = (state: RootState) => state.controlNet;
