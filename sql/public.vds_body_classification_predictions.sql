--
-- PostgreSQL database dump
--

-- Dumped from database version 9.1.14
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: vds_body_classification_predictions; Type: TABLE; Schema: public; Owner: arbtrucks
--

CREATE TABLE vds_body_classification_predictions (
    sig_id integer NOT NULL,
    final_prediction integer,
    model1 integer,
    model2 integer,
    model3 integer,
    model4 integer,
    model5 integer
);


ALTER TABLE vds_body_classification_predictions OWNER TO arbtrucks;

--
-- Name: vds_body_classification_predictions body_classification_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: arbtrucks
--

ALTER TABLE ONLY vds_body_classification_predictions
    ADD CONSTRAINT body_classification_predictions_pkey PRIMARY KEY (sig_id);


SET default_tablespace = arbtrucks;

--
-- Name: idx_sigid_class; Type: INDEX; Schema: public; Owner: arbtrucks; Tablespace: arbtrucks
--

CREATE INDEX idx_sigid_class ON vds_body_classification_predictions USING btree (sig_id, final_prediction);


--
-- Name: vds_body_classification_predictions; Type: ACL; Schema: public; Owner: arbtrucks
--

REVOKE ALL ON TABLE vds_body_classification_predictions FROM PUBLIC;
REVOKE ALL ON TABLE vds_body_classification_predictions FROM arbtrucks;
GRANT ALL ON TABLE vds_body_classification_predictions TO arbtrucks;
GRANT SELECT ON TABLE vds_body_classification_predictions TO data_analyst;


--
-- PostgreSQL database dump complete
--

