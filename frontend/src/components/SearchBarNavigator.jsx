import { useNavigate } from "react-router";
import { useState } from 'react';

import SearchBar from './SearchBar.jsx';

export default function SearchBarNavigator() {
	const [value, setValue] = useState('');
	const navigate = useNavigate();

	const changeHandler = (e) => {
		setValue(e.target.value);
	};

	const searchHandler = (e) => {
		navigate(`/search?q=${encodeURIComponent(value)}`);
	};

    return (
		<SearchBar
			value={value}
			onSubmit={searchHandler}
			onChange={changeHandler}
			/>
    );
}
