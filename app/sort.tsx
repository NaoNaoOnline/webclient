import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

interface Option {
  name: string;
}

const options = [
  { id: 1, name: "sort by time", disabled: false },
  { id: 2, name: "sort by clicks", disabled: true },
]

export default function Sort() {
  const [selected, setSelected] = useState(options[0])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? options
      : options.filter((option) =>
        option.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  return (
    <div className="absolute right-0 top-0 inline-block text-left h-full">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm">
            <Combobox.Input
              className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900"
              displayValue={(option: Option) => option.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((option) => (
                  <Combobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `
                        ${active && option.disabled ? 'text-gray-300' : ''} 
                        ${!active && option.disabled ? 'text-gray-300' : ''} 
                        ${!active && !option.disabled ? 'text-gray-900' : ''} 
                        ${active && !option.disabled ? 'bg-violet-600 text-white' : ''} 
                        ${selected ? 'font-medium' : 'font-normal'}
                        relative cursor-default select-none py-2 pl-3
                      `
                    }
                    value={option}
                    disabled={option.disabled}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className="block truncate">
                          {option.name}
                        </span>
                        {selected && !option.disabled ? (
                          <span className={`absolute inset-y-0 right-0 flex items-center pr-3 ${active ? 'text-white' : 'text-violet-600'}`}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox >
    </div >
  )
}
