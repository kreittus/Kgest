import { Button, CircularProgress } from '@material-ui/core';

export function ButtonPsl({ loading, title = "Salvar" }) {


    return (

        <div>

            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
            >
                {loading && <CircularProgress size={24} />}
                {loading ? <> &nbsp; &nbsp;</> : <></>}
                {title}
            </Button>

        </div>

    );
}