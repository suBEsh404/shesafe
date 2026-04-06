import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { BlockchainTransaction, BlockSummary } from '../../types/blockchain.types'
import { fetchBlockchain, type BlockchainPayload } from './blockchainAPI'

type BlockchainState = {
  status: string
  latestBlocks: BlockSummary[]
  transactions: BlockchainTransaction[]
  loadStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: BlockchainState = {
  status: 'Stable',
  latestBlocks: [],
  transactions: [],
  loadStatus: 'idle',
}

export const loadBlockchain = createAsyncThunk<BlockchainPayload>(
  'blockchain/load',
  async () => fetchBlockchain(),
)

const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBlockchain.pending, (state) => {
        state.loadStatus = 'loading'
        state.error = undefined
      })
      .addCase(loadBlockchain.fulfilled, (state, action) => {
        state.loadStatus = 'succeeded'
        state.status = action.payload.status
        state.latestBlocks = action.payload.latestBlocks
        state.transactions = action.payload.transactions
      })
      .addCase(loadBlockchain.rejected, (state) => {
        state.loadStatus = 'failed'
        state.error = 'Unable to load blockchain data.'
      })
  },
})

export default blockchainSlice.reducer
