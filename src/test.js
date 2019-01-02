import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
// this adds custom jest matchers from jest-dom
import 'jest-dom/extend-expect'

import ReactSearchBox from './'

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup)

const data = [
  {
    key: 'john',
    value: 'John Doe',
  },
  {
    key: 'jane',
    value: 'Jane Doe',
  },
  {
    key: 'mary',
    value: 'Mary Phillips',
  },
  {
    key: 'robert',
    value: 'Robert',
  },
  {
    key: 'karius',
    value: 'Karius',
  },
]

describe('Input Box', () => {
  test('should be present in the document', () => {
    const { getByPlaceholderText } = render(
      <ReactSearchBox placeholder="Put some text in here!" />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    expect(inputNode).toBeInTheDocument()
  })

  test('should be rendered by default with the supplied props  ', () => {
    const { getByPlaceholderText } = render(
      <ReactSearchBox placeholder="Put some text in here!" />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    expect(inputNode.value).toEqual('')
  })

  test('value should change when the onChange event is fired', () => {
    const { getByPlaceholderText } = render(
      <ReactSearchBox placeholder="Put some text in here!" />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    fireEvent.change(inputNode, {
      target: { value: 'This is the text which I typed in it!' },
    })

    expect(inputNode.value).toEqual('This is the text which I typed in it!')
  })

  test('should focus on the input if autoFocus prop is true', () => {
    const { getByPlaceholderText } = render(
      <ReactSearchBox placeholder="Put some text in here!" autoFocus />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    expect(inputNode).toHaveFocus()
  })

  test("shouldn't focus on the input if autoFocus prop is false/not passed", () => {
    const { getByPlaceholderText } = render(
      <ReactSearchBox placeholder="Put some text in here!" />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    expect(inputNode).not.toHaveFocus()
  })

  test('should trigger onFocus callback if the input is focussed', () => {
    const onFocus = jest.fn()
    const { getByPlaceholderText } = render(
      <ReactSearchBox
        placeholder="Put some text in here!"
        autoFocus
        onFocus={onFocus}
      />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  test("shouldn't trigger onFocus callback if the input is not in focus", () => {
    const onFocus = jest.fn()
    const { getByPlaceholderText } = render(
      <ReactSearchBox placeholder="Put some text in here!" onFocus={onFocus} />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    expect(onFocus).toHaveBeenCalledTimes(0)
  })

  test('shouldn trigger onChange callback if the value of the input box changes', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <ReactSearchBox
        placeholder="Put some text in here!"
        onChange={onChange}
      />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    fireEvent.change(inputNode, {
      target: { value: 'Doe' },
    })

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  test("shouldn't trigger onChange callback if the value of the input box doesn't change", () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <ReactSearchBox
        placeholder="Put some text in here!"
        onChange={onChange}
      />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    expect(onChange).toHaveBeenCalledTimes(0)
  })
})

describe('Dropdown', () => {
  test('should render when there is a value in the input box', () => {
    const { container, getByPlaceholderText } = render(
      <ReactSearchBox placeholder="Put some text in here!" />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    fireEvent.change(inputNode, {
      target: { value: 'Doe' },
    })

    const dropdownNodes = container.querySelectorAll(
      '.react-search-box-dropdown'
    )

    expect(dropdownNodes.length).toEqual(1)
  })

  test("shouldn't render when there is no value in the input box", async () => {
    const { container } = render(
      <ReactSearchBox placeholder="Put some text in here!" />
    )
    const dropdownNodes = container.querySelectorAll(
      '.react-search-box-dropdown'
    )

    expect(dropdownNodes.length).toEqual(0)
  })

  test("should render matched items from the data array if any items matches with the input's value", () => {
    const { container, getByPlaceholderText } = render(
      <ReactSearchBox placeholder="Put some text in here!" data={data} />
    )
    let inputNode = getByPlaceholderText('Put some text in here!')

    fireEvent.change(inputNode, {
      target: { value: 'John' },
    })

    let dropdownNodes = container.querySelectorAll(
      '.react-search-box-dropdown-list-item'
    )

    expect(dropdownNodes.length).toEqual(1)

    fireEvent.change(inputNode, {
      target: { value: 'Doe' },
    })

    dropdownNodes = container.querySelectorAll(
      '.react-search-box-dropdown-list-item'
    )

    expect(dropdownNodes.length).toEqual(2)
  })

  test('should update the value of the input box once clicked on any dropdown item', () => {
    const handleClick = jest.fn()
    const { getByPlaceholderText, getByText } = render(
      <ReactSearchBox
        placeholder="Put some text in here!"
        data={data}
        onSelect={handleClick}
      />
    )
    let inputNode = getByPlaceholderText('Put some text in here!')

    fireEvent.change(inputNode, {
      target: { value: 'Doe' },
    })

    fireEvent.click(getByText('John Doe'))

    inputNode = getByPlaceholderText('Put some text in here!')

    expect(inputNode.value).toEqual('John Doe')

    fireEvent.change(inputNode, {
      target: { value: 'Doe' },
    })

    fireEvent.click(getByText('Jane Doe'))

    inputNode = getByPlaceholderText('Put some text in here!')

    expect(inputNode.value).toEqual('Jane Doe')
  })

  test('should close the dropdown onClick of any dropdown item', () => {
    const handleClick = jest.fn()
    const { container, getByText, getByPlaceholderText } = render(
      <ReactSearchBox
        placeholder="Put some text in here!"
        data={data}
        onSelect={handleClick}
      />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    fireEvent.change(inputNode, {
      target: { value: 'Doe' },
    })

    fireEvent.click(getByText('John Doe'))

    const dropdownNodes = container.querySelectorAll(
      '.react-search-box-dropdown-list-item'
    )

    expect(dropdownNodes.length).toEqual(0)
  })

  test('should trigger the onSelect prop onClick of any dropdown item', () => {
    const handleClick = jest.fn()
    const { getByText, getByPlaceholderText } = render(
      <ReactSearchBox
        placeholder="Put some text in here!"
        data={data}
        onSelect={handleClick}
      />
    )
    const inputNode = getByPlaceholderText('Put some text in here!')

    fireEvent.change(inputNode, {
      target: { value: 'Doe' },
    })

    fireEvent.click(getByText('John Doe'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
