'use client'

import { useState } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { usecrudProgram, usecrudProgramAccount } from './journal-data-access'
import { ellipsify } from '@/lib/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

export function CounterCreate() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const { createEntry } = usecrudProgram()
  const { publicKey } = useWallet()

  if (!publicKey) {
    return <div className="text-center text-red-600">Please connect your wallet.</div>
  }

  const isFormValid = (title.trim() || message.trim()) !== ''

  const handleSubmit = async () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey })
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        disabled={createEntry.isPending || !isFormValid}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {createEntry.isPending ? 'Creating...' : 'Create Journal Entry'}
      </button>
    </div>
  )
}

export function CounterList() {
  const { accounts, getProgramAccount } = usecrudProgram()

  if (getProgramAccount.isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info text-center p-4 border border-blue-300 rounded-md">
        Program account not found. Ensure your program is deployed and you're on the correct cluster.
      </div>
    )
  }

  return (
    <div className="mt-12">
      {accounts.isLoading ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : accounts.data ? (
        <div className="grid md:grid-cols-2 gap-6">
          {accounts.data.map((account) => (
            <CounterCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center text-lg">No accounts found. Create one above to get started.</div>
      )}
    </div>
  )
}

function CounterCard({ account }: { account: PublicKey }) {
  const { updateJournal, deleteJournal, accountQuery } = usecrudProgramAccount({ account })
  const { publicKey } = useWallet()
  const [message, setMessage] = useState('')
  const title = accountQuery.data?.title
  const owner = accountQuery.data?.owner.toBase58()

  const isFormValid = message.trim() !== ''

  const handleSubmit = () => {
    if (publicKey && isFormValid && title) {
      updateJournal.mutateAsync({ title, message, owner: publicKey })
    }
  }

  if (!publicKey) {
    return <div className="text-center text-red-600">Please connect your wallet.</div>
  }

  return accountQuery.isLoading ? (
    <div className="flex justify-center items-center">Loading...</div>
  ) : (
    <div className="bg-black shadow-md rounded-lg p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <h3
        onClick={() => accountQuery.refetch()}
        className="text-xl font-semibold text-blue-600 cursor-pointer hover:text-blue-800"
      >
        {accountQuery.data?.title}
      </h3>
      <p className="text-gray-600 mt-2">{accountQuery.data?.message}</p>
      <div className="mt-4 space-y-4">
        <textarea
          placeholder="Update message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={updateJournal.isPending || !isFormValid}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {updateJournal.isPending ? 'Updating...' : 'Update Journal Entry'}
        </button>
        <div className="flex justify-between items-center">
          <div>
            <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
            <div>
              Owner:
              <ExplorerLink path={`address/${owner}`} label={ellipsify(owner)} className="ml-2" />
            </div>
          </div>
          <button
            onClick={() => {
              if (!window.confirm('Are you sure you want to close this account?')) return
              const title = accountQuery.data?.title
              if (title) {
                return deleteJournal.mutateAsync(title)
              }
            }}
            disabled={deleteJournal.isPending}
            className="text-red-600 hover:text-red-800 focus:outline-none"
          >
            {deleteJournal.isPending ? 'Closing...' : 'Close Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
