var scriptVersion = "0.1.4",
  targetValues = [
    "Heart 1",
    "The JormagVoid",
    "The PrimordusVoid",
    "The KralkatorrikVoid",
    "Zeitzauberer der Leere",
    "The MordremothVoid",
    "The ZhaitanVoid",
    "Leere-Salzgischtdrachen",
    "The SooWonVoid",
    "Heart 4",
  ],
  validPhases = [
    "Purification 1",
    "Jormag",
    "Primordus",
    "Kralkatorrik",
    "Zeitzauberer der Leere",
    "Purification 2",
    "Mordremoth",
    "Zhaitan",
    "Void Saltspray Dragon",
    "Purification 3",
    "Soo-Won 1",
    "Purification 4",
    "Soo-Won 2",
  ],
  mechanicsToCheck = [
    "Void.D",
    "J.Breath.H",
    "Slam.H",
    "Barrage.H",
    "ShckWv.H",
    "Whrlpl.H",
    "Tsunami.H",
    "Claw.H",
  ],
  ss = SpreadsheetApp.getActiveSpreadsheet(),
  logSheet = ss.getSheetByName("Logs"),
  staticSheet = ss.getSheetByName("Setup und Co"),
  mechanicSheet = ss.getSheetByName("Mechanics"),
  statisticsSheet = ss.getSheetByName("Statistics"),
  settingsSheet = ss.getSheetByName("Settings"),
  // Colors
  lightGray = "#efefef",
  mechanics_button_url =
    "https://lh3.googleusercontent.com/fife/AKsag4O5APaNGjvOuSuIshgutY5rR1elxX_4VGDNrXQ89qWu56LFVord8gF-o_5X_nzEezlWFR67DKgBmTOdxde_h5QISv-LiQxaAs0Nvpm2LJXl_U1VCxBQk2SVtQgYD3Snzf2EgKBLLYbTOQSU5As1RVo9XzlSfzqTER08otSR8pC1tgNULeTqdUtNv7v2GB8gKP21QIMK67K-GjQZzSSJMNH8LVStCt4mD3PtYGnZ93LlNVx25O_BjQ_AXPNmwJiFzClJs4QtvUu4CscPXN12raefpyYUaBCWpZ3WTTtHMDQ_ffPLZ-T2W5Cvq3AMI2bBIB2IxwH397ePuO2kn2LEfptrUiWljb5iy17kPgzbFZn-lz_Gb_M8OJ6zldCIx4T5cP7PocL6yqriNhKp_n4JnnOYnQKloeBxRyA30oFViGTDdkXLV66mehmXyswAgv8gMbpbafP_WS550mECrl5ku9RZIf8-W00IDnaqK6ipcoHQVryd46tUcGSJl2B_9MbUxpchcD2UW4xyxWiV2Bj6cHRAVJa6jcQpgRKssq_hSUMTsQTASFM9yW_FxhcWDU78kMYRaBWhu1evNppJJd1vaQDSoh3NwtcO11pJN3iUy6UsYouBT429VLQcDkepwi0ZF1S-o2GRe8NgRZzTHhpwpwi_uHL_pZBwaKFww6VzvPPs9yDetb-TB6YddhjTTTkFNjmNhE5GEwHkJdAE2QLotdZMrSuB1FcDL_w3K2fO5KkSIY4JTDpKA3Ov3R2y62ha9RWhDG5RQxZRYtmnKbagS5a1vPaP3hTvh0OGpwK-_9CHhkDrjUBlXOkZQOxS7drbLu4B2XtsZZDbSP7GDyp56Y1KQgWaYGY6yLiArOFU1VKki13hsop_bDz_CjV6LL_JFBq-9ApybnTPrHxDso_DKimaN9BbaXEEdDbneujn1TwMB75IoEneFnlh7f-PbxceE7TEV-pGT5uinYBIcgj_vNnPQgEgygtO8QLx2mgeFOwgDMfH9W610tCyQT5_92ByYVbkPFBpEMU4sEr38U-kj-E9PQ8SuCeDwCdAptSUjT2msmtJerhBlnxm7rpmHlOEP5gmrU8VdM9A1kTGCP3syMl_iZArCHqyTLe8vftzr5sSxW0N4d-drJ7YbVji87jrX7v8D05VT1ccOIEJMJVzU8t4k_RhWl5wz3fDboycFZtpdl-Q47N5TNcIzBmEPemPr9baiRu7cDnhXTyW4sxeANsCBu7-5WiIkMwEz20P_Rs40zMQLIlICFUGqXRjvGLXvCw-JeV5YLolXSkHYq9Z_AhlqsTvfJXThodX-JZdNSJXUGV2zu2aWEDfKwHel-yIbt6ItYua9kwe9OtUfHPoNsbjUSSTHEMv9fU7HYqIFlpbxbcS8axQczaf_7IlLvU5jr8ZznYEPtbGeH89w8Tx76jg7QDKh6dCaS6UCgdlIfZCy90Tlz5wyNQj8HubMLYv9o1eSXsQN9OxykybnCXOa6se6HIvCaj81gqeSFDQ55kO-Fbz7965CturGud-ivOb0Ib6FFj6Ff0yQiPRZzZr9rUlhwgGTPNCZS3EdcoliUqkRw=w2505-h1337";
