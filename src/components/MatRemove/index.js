import { useState } from 'react';
import { FormControlLabel, IconButton } from '@material-ui/core';
import { red } from "@material-ui/core/colors";
import { supabase } from '../../services/supabase';

import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';


export function MatRemove({ index, table, refresh }) {
    const [loading, setLoading] = useState(false);

    const handleRemoveClick = async () => {
        if (window.confirm('Deseja Realmente Excluir este registro?')) {
            setLoading(true);
            const { error } = await supabase
                .from(table)
                .delete()
                .match({ id: index });

            if (error) {
                setLoading(false);
                alert(error.message);
                return;
            } else {
                setLoading(false);
                alert('Excluido!');
                refresh();

            };

        }
    };

    return (
        <div>
            {!loading ?

                <FormControlLabel
                    control={
                        <IconButton
                            color="secondary"
                            aria-label="add an alarm"
                            onClick={handleRemoveClick}

                        >

                            <DeleteIcon style={{ color: red[500] }} />

                        </IconButton>
                    }
                />


                :
                <CircularProgress size={24} />
            }

        </div>
    );

}